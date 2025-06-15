const express = require('express');
const { ethers, formatEther } = require("ethers");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cors = require('cors');
const axios = require("axios");
const PORT = process.env.PORT || 3000;
const Groq = require('groq-sdk');
require('./google')
require('dotenv').config();
const app = express();
app.use(express.json());

const SEPOLIA_API_URL = "https://api-sepolia.etherscan.io/api";
const SEPOLIA_ETHERSCAN_API = process.env.SEPOLIA_ETHERSCAN_API; 
const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS; 
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const loadingUsers = new Set(); // loading_userId
const connectedUsers = new Map(); // connected_userId
const roomIDs = new Set(); // Ongoing Game RoomIDs
const txHashes = new Set(); // txHash

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY // Set your Groq API key in env
});

app.use(cors({
    origin: process.env.CLIENT_API_URL
}));

// Hint function
async function getHintFromGroq(questionHtml, userInput) {
  console.log("Hint start");
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `You are an assistant for a competitive coding game.
            Your job is to provide only:
            - explanations
            - hints
            - clarifications

            You must NOT:
            - give code
            - give the correct answer
            - suggest output values

            Provide output only in text form in paragraph structure (one single paragraph, don't make points) using alphanumeric symbols`,
      },
      {
        role: 'user',
        content: `Question:\n${questionHtml}\n\nUser's Input:\n${userInput}`,
      },
    ],
    model: 'mistral-saba-24b',
    temperature: 0.6,
    max_completion_tokens: 128,
    top_p: 1,
    stream: true,
    stop: null,
  });

  let fullResponse = '';

  for await (const chunk of chatCompletion) {
    const text = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(text); // Optional: live streaming to terminal
    fullResponse += text;
  }
  console.log(fullResponse);

  return fullResponse;
}

// Initialize Socket.IO
const io = new Server(server, {
  cors: { 
    origin: process.env.CLIENT_API_URL,
    credentials: true
  },
});

// Handle waiting players
var waitingPlayer = null;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function Transaction(wallet_address, amount){
  console.log(`Transaction initiated for ${wallet_address} with Amount: ${amount}`);

  // Load Alchemy RPC URL and your private key
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_ALCHEMY_API_URL);
  const wallet = new ethers.Wallet(process.env.ADMIN_WALLET_PRIVATE_KEY, provider);
  try {
      const tx = await wallet.sendTransaction({
          to: wallet_address, // Recipient's wallet address
          value: ethers.parseEther(amount), // 0.01 ETH, etc.
      });

      await tx.wait(); // Optional: wait for mining
      console.log(`Transaction successful with hash: ${tx.hash}`);
  } catch (err) {
      console.error(err);
  }
}

// Handle player connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  function timer(roomID, wallet_address, opponentWalletAddress){
    setTimeout(() => {
      if(roomIDs.has(roomID)){
        io.to(roomID).emit('game_tied');
        Transaction(wallet_address.toString(),"0.0009");
        Transaction(opponentWalletAddress.toString(),"0.0009");
        console.log(`⏱ Game in ${roomID} tied (time up)`);
      }
    }, (15 * 60 * 1000) + 3000);
  }

  socket.on('join_game', async ({ walletAddress, username, email, id }) => {
    console.log(`Player ${username} (${walletAddress}) wants to join a game.`);

    if (waitingPlayer) {
      await delay(3000);
      const opponentSocket = waitingPlayer.socket;
      const opponentUsername = waitingPlayer.username;
      const opponentWalletAddress = waitingPlayer.walletAddress;
      const opponentEmail = waitingPlayer.email;
      const opponentId = waitingPlayer.id;
      const [result] = await pool.query('SELECT max(id) AS maxId from games');
      const roomID = result[0].maxId + 1;
      await pool.query(
              'INSERT INTO games (player1_id, player2_id, winner_id,stake_amount) VALUES (?, ?, ?, ?)',
              [id, opponentId,0,0.001]
            );
      waitingPlayer = null;

      // Fetch a CP question from external API
      const res = await axios.get(`${process.env.PYTHON_API_URL}/random_problem`);
      
      loadingUsers.delete(email);
      loadingUsers.delete(opponentEmail);
      connectedUsers.set(email,roomID);
      connectedUsers.set(opponentEmail,roomID);

      io.to(socket.id).emit('game_start', {
        roomID,
        html: res.data.html,
        opponent: opponentUsername,
        opponentWalletAddress: opponentWalletAddress,
        problemID: res.data.id
      });

      io.to(opponentSocket.id).emit('game_start', {
        roomID,
        html: res.data.html,
        opponent: username,
        opponentWalletAddress: walletAddress,
        problemID: res.data.id
      });

      roomIDs.add(roomID);
      timer(roomID,walletAddress,opponentWalletAddress);

      console.log(`Game started in ${roomID}`);
    } else {
      waitingPlayer = {socket,username,walletAddress,email,id};
      console.log('Waiting for second player...');
    }
  });

  socket.on('joined_room', ({ roomID, email }) => {
    if(connectedUsers.get(email) && connectedUsers.get(email) !== roomID) return;
    connectedUsers.delete(email);
    socket.join(roomID);
    console.log(`Socket ${socket.id} joined room ${roomID}`);
  });

  socket.on('get_hint', async ({ html, chatMessage }) => {
    const hint = await getHintFromGroq(html, chatMessage);
    io.to(socket.id).emit('hint_response',hint);
  });

  socket.on('run_code', async ({ languageCode, code, input }) => {
    try {
      console.log("run code initialised");
      const res = await axios.post(process.env.PYTHON_API_URL + '/run', {
        languageCode,
        code,
        input
      });
      io.to(socket.id).emit('code_output', res.data.toString());
    } catch (err) {
      console.error('Error running code:', err.message || err);
    }
  });


  socket.on('submit_code', async ({ roomID, selectedLanguage, problemID, code, languageExtension, WalletAddress, OpponentWalletAddress, Id }) => {
    roomIDs.delete(roomID);
    const [result] = await pool.query('SELECT * FROM games where id = ?',[roomID]);
    console.log(result[0]);
    const game = result[0];
    
    if (!game || game.winner_id) return;

    try {
      const res = await axios.post(process.env.PYTHON_API_URL + '/submit', {
        problemID,
        selectedLanguage,
        code,
        languageExtension
      });
      console.log(res.data);
      if(res.data == "ACCEPTED"){
        await pool.query(
          'UPDATE games SET winner_id = ? WHERE id = ?',
          [Id, roomID]
        );
        Transaction(WalletAddress.toString(),"0.0018");
      }
      else Transaction(OpponentWalletAddress.toString(),"0.0011");

      io.to(roomID).emit('submitted');
    } catch (err) {
      console.error('Error running code:', err.message || err);
    }
  });


  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
    if (waitingPlayer && waitingPlayer.socket.id === socket.id) {
      waitingPlayer = null;
    }
  });


}); // End of socket.io connection

// Initialize Passport.js
app.use(passport.initialize());
// Route to start the authentication process
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Callback route after Google authentication
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/', session: false }),
    (req, res) => {
        // Generate JWT payload - you can customize this
        const payload = {
          id : req.user.id,
          username : req.user.username,
          email : req.user.email,
          wallet_address : null,
        };
        // Successful authentication, generate JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        // Redirect to the external website with the JWT as a query parameter
        res.redirect(`${process.env.CLIENT_API_URL}/setjwt?token=${token}`); // Change to your desired URL
    }
);

app.post('/verify-token', (req,res) => { // type-1 is basic, type-2 is loading, type-3 is gaming
  const { type } = req.body;
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({ status: 0, error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    if(type == '3'){
      if(connectedUsers.has(decoded.email)) res.json({ status: 1 });
      else res.json({ status: 0 });
    }
    else if(type == '2'){
      if(loadingUsers.has(decoded.email)) res.json({ status: 1 });
      else res.json({ status: 0 });
    }
    else if(decoded.email && decoded.wallet_address) res.json({ status: 2 });
    else if(decoded.email) res.json({ status: 1 });
    else res.json({ status: 0 });
  });
});

app.post('/profile-verify', (req,res) => { // type-1 is basic, type-2 is loading, type-3 is gaming
  const { UserId } = req.body;
  const token = req.headers.authorization;
  if (!token || !UserId) return res.json({status: 0});

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || !decoded || !decoded.id || !decoded.username || !decoded.email || !decoded.wallet_address) {
      return res.json({status: 0});
    }
    if(UserId!=decoded.id){
      let [status] = await pool.query(
        'SELECT status FROM friends WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)',
        [decoded.id, UserId, UserId, decoded.id]
      );
      if(!status || status.length === 0 || status[0].status === false){
        return res.json({status: 0});
      }
    }
    return res.json({status: 1});
  });
});


app.post('/auth/metamask', async (req, res) => {
  const { address } = req.body;
  const token = req.headers.authorization;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    if(decoded && decoded.email){
      await pool.query('UPDATE users SET wallet_address = ? WHERE email = ?',[address,decoded.email]);
      const payload = {
          id : decoded.id,
          username : decoded.username,
          email : decoded.email,
          wallet_address : address,
        };
        // Successful authentication, generate JWT
        const new_token = jwt.sign(payload, process.env.JWT_SECRET);
        res.send(new_token);
    }
    else res.status(400).json({ error: 'No user in token' });
  });
});

app.post('/set-loading', async (req, res) => {
  const { txHash } = req.body;
  console.log(txHash);
  const token = req.headers.authorization;
  if (!txHash || txHashes.has(txHash)) return res.status(400).json({ error: 'Provide all things!!' });
  
  try{

    const txRes = await axios.get(SEPOLIA_API_URL, {
      params: {
        module: "proxy",
        action: "eth_getTransactionByHash",
        txhash: txHash,
        apikey: SEPOLIA_ETHERSCAN_API,
      },
    });
    
    const tx = txRes.data?.result;
    if (!tx) return { success: false, error: "Transaction not found" };
  
    const toAddress = tx.to?.toLowerCase();
    if (toAddress !== ADMIN_WALLET_ADDRESS.toLowerCase() || parseFloat(formatEther(tx.value)) < 0.001) return res.status(400).json({ error: 'Wrong Transaction' });
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 0, error: 'Invalid token' });
      }
      if(decoded && decoded.email && decoded.wallet_address){
        loadingUsers.add(decoded.email);
        txHashes.add(txHash);
      }
      else return res.status(401).json({ status: 0, error: 'Invalid token' });
    });
    console.log("Loading users: ",loadingUsers);
    console.log("Transaction Hashes: ",txHashes);
    res.status(200).json({ message: 'Loading started' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/data', async (req, res) => {
  let UserID = req.body.UserID;
  const token = req.headers.authorization;
  let userdata;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  if(UserID){
    let [data]  = await pool.query(
      `SELECT 
          g.id AS id,
          CASE 
              WHEN g.player1_id = ? THEN u2.username
              ELSE u1.username
          END AS opponent_username,
          g.winner_id AS winner_id,
          g.stake_amount AS stake_amount,
          g.completed_at AS completed_at
      FROM games g
      JOIN users u1 ON g.player1_id = u1.id
      JOIN users u2 ON g.player2_id = u2.id
      WHERE g.player1_id = ? OR g.player2_id = ?;`,
      [UserID, UserID, UserID]
    );
    res.json(data);
  }
  else{
    let [data]  = await pool.query(
      'SELECT * FROM games WHERE player1_id = ? OR player2_id = ?',
      [userdata.id,userdata.id]
    );
    data.push({
      id: userdata.id,
      username: userdata.username,
      email: userdata.email,
      wallet_address: userdata.wallet_address
    });
    res.json(data);
  }
});

app.get('/get-friends', async (req, res) => {
  let userdata;
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  let [data]  = await pool.query(
    `SELECT 
      u.id AS id,
      u.username,
      u.wallet_address AS walletAddress,
      '👑' AS avatar,

      COUNT(g.id) AS gamesPlayed,
      COUNT(CASE WHEN g.winner_id = u.id THEN 1 END) AS gamesWon

    FROM friends f

    JOIN users u ON u.id = 
      CASE 
        WHEN f.requester_id = ? THEN f.addressee_id
        WHEN f.addressee_id = ? THEN f.requester_id
      END

    LEFT JOIN games g ON (g.player1_id = u.id OR g.player2_id = u.id)

    WHERE f.status = TRUE
      AND (? IN (f.requester_id, f.addressee_id))

    GROUP BY u.id, u.username, u.wallet_address;`,
    [userdata.id,userdata.id,userdata.id]
  );
  let [data2]  = await pool.query(
    `SELECT 
      u.id AS id,
      u.username,
      u.wallet_address AS walletAddress,
      '👑' AS avatar
    FROM friends f
    JOIN users u ON u.id = f.requester_id
    WHERE f.addressee_id = ?
      AND f.status = FALSE;`,
    [userdata.id]
  );
  res.json({
    "Friends" : data,
    "FriendsRequests" : data2
  });
});

app.post('/search-friends', async (req, res) => {
  let userdata;
  const { searchQuery } = req.body;
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  let [data]  = await pool.query(
    `SELECT
      u.id AS id,
      u.username AS username,
      u.wallet_address AS walletAddress,
      '👑' AS avatar
    FROM users u
    WHERE u.id != ?
      AND (
        u.username LIKE CONCAT('%', ? , '%')
        OR u.wallet_address LIKE CONCAT('%', ? , '%')
        OR u.email LIKE CONCAT('%', ? , '%')
      )
      AND u.id NOT IN (
        SELECT
          CASE
            WHEN f.requester_id = ? THEN f.addressee_id
            ELSE f.requester_id
          END
        FROM friends f
        WHERE (f.requester_id = ? OR f.addressee_id = ?)
      );`,
    [userdata.id,searchQuery,searchQuery,searchQuery,userdata.id,userdata.id,userdata.id]
  );
  res.json(data);
});

app.post('/request-friend', async (req, res) => {
  let userdata;
  const { requestId , value } = req.body;
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  if(value){
    await pool.query(
      'UPDATE friends SET status = TRUE WHERE requester_id = ? AND addressee_id = ?',
      [requestId, userdata.id]
    );
  }
  else {
    await pool.query(
      'DELETE FROM friends WHERE requester_id = ? AND addressee_id = ?',
      [requestId, userdata.id]
    );
  }
  res.send("Done!");
});

app.post('/add-friend', async (req, res) => {
  let userdata;
  const { FriendId } = req.body;
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  const [result] = await pool.query(
    'SELECT * FROM friends WHERE requester_id = ? AND addressee_id = ?',
    [FriendId, userdata.id]
  );
  if(result.length > 0){
    await pool.query(
      'UPDATE friends SET status = TRUE WHERE requester_id = ? AND addressee_id = ?',
      [FriendId, userdata.id]
    );
  }
  else {
    await pool.query(
      'INSERT INTO friends (requester_id, addressee_id, status) VALUES (?, ?, FALSE)',
      [userdata.id, FriendId]
    );
  }
  res.send("Done!");
});

app.post('/player-data', async (req, res) => {
  let UserID = req.body.UserId;
  const token = req.headers.authorization;
  let userdata;
  if(!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  if(!UserID) return res.status(400).json({ status: 0, error: 'No UserID provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || !decoded || !decoded.id || !decoded.username || !decoded.email || !decoded.wallet_address) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
    if(UserID!=userdata.id){
      let [status] = await pool.query(
        'SELECT status FROM friends WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)',
        [userdata.id, UserID, UserID, userdata.id]
      );
      if(!status || status.length === 0 || status[0].status === false){
        return res.status(400).json({ status: 0, error: 'You are not friends with this user' });
      }
    }
  
    let [data]  = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [UserID]
    );
    res.json(data[0]);
  });
});

app.post('/player-matches-data', async (req, res) => {
  let UserID = req.body.UserId;
  const token = req.headers.authorization;
  if(!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  if(!UserID) return res.status(400).json({ status: 0, error: 'No UserID provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || !decoded || !decoded.id || !decoded.username || !decoded.email || !decoded.wallet_address) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    if(UserID!=decoded.id){
      let [status] = await pool.query(
        'SELECT status FROM friends WHERE (requester_id = ? AND addressee_id = ?) OR (requester_id = ? AND addressee_id = ?)',
        [decoded.id, UserID, UserID, decoded.id]
      );
      if(!status || status.length === 0 || status[0].status === false){
        return res.status(400).json({ status: 0, error: 'You are not friends with this user' });
      }
    }
  
    let [data]  = await pool.query(
      'SELECT * FROM games WHERE player1_id = ? OR player2_id = ?',
      [UserID,UserID]
    );
    res.json(data);
  });
});

app.get('/leaderboard-data', async (req, res) => {
  const token = req.headers.authorization;
  if(!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || !decoded || !decoded.id || !decoded.username || !decoded.email || !decoded.wallet_address) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
  
    let [data]  = await pool.query(
      `WITH total_games AS (
          SELECT 
              u.id AS user_id,
              COUNT(g.id) AS total_matches
          FROM users u
          LEFT JOIN games g 
              ON u.id = g.player1_id OR u.id = g.player2_id
          GROUP BY u.id
      ),
      wins_and_eth AS (
          SELECT 
              u.id AS user_id,
              COUNT(g.id) AS won_matches,
              ROUND(SUM(g.stake_amount * 1.8), 3) AS eth_earned
          FROM users u
          JOIN games g 
              ON u.id = g.winner_id
          GROUP BY u.id
      ),
      final_stats AS (
          SELECT
              u.id,
              u.username,
              COALESCE(tg.total_matches, 0) AS totalMatches,
              COALESCE(we.won_matches, 0) AS wonMatches,
              COALESCE(we.eth_earned, 0) AS ethEarned,
              ROUND(
                  100.0 * COALESCE(we.won_matches, 0) / NULLIF(COALESCE(tg.total_matches, 0), 0),
                  2
              ) AS winPercentage
          FROM users u
          LEFT JOIN total_games tg ON u.id = tg.user_id
          LEFT JOIN wins_and_eth we ON u.id = we.user_id
      )
      SELECT
          id,
          RANK() OVER (
              ORDER BY wonMatches DESC, totalMatches
          ) AS u_rank,
          username,
          winPercentage,
          ethEarned,
          totalMatches,
          wonMatches
      FROM final_stats
      WHERE totalMatches > 0
      ORDER BY wonMatches DESC, totalMatches
      LIMIT 10;`
    );
    res.json(data);
  });
});


app.get('/test', async (req, res) => {
  console.log("Loading users: ",loadingUsers);
  console.log("Connected users: ",connectedUsers);
  console.log("Transaction Hashes: ",txHashes);
  const x = await axios.get(`${process.env.PYTHON_API_URL}/random_problem`);
  console.log(x.data);
  // const [users] = await pool.query('SELECT * FROM users');
  // const [games] = await pool.query('SELECT * FROM games');
  // const [friends] = await pool.query('SELECT * FROM friends');
  // console.log(users);
  // console.log(games);
  // console.log(friends);
  res.send("Go Away! It's a top secret place");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
