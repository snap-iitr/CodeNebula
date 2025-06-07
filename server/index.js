const express = require('express');
const { ethers, formatEther } = require("ethers");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cors = require('cors');
const axios = require("axios");
const PORT = process.env.PORT || 3000;
require('./google')
const app = express();
app.use(express.json());
app.use(cookieParser());

const SEPOLIA_API_URL = "https://api-sepolia.etherscan.io/api";
const SEPOLIA_ETHERSCAN_API = process.env.SEPOLIA_ETHERSCAN_API; 
const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS; 
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const loadingUsers = new Set(); // loading_userId
const connectedUsers = new Map(); // connected_userId
const txHashes = new Set(); // txHash

app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true
}));

// Configure session middleware
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialize Socket.IO
const io = new Server(server, {
  cors: { 
    origin: 'http://localhost:5000',
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
      io.to(roomID).emit('game_tied');
      Transaction(wallet_address.toString(),"0.0009");
      Transaction(opponentWalletAddress.toString(),"0.0009");
      console.log(`⏱ Game in ${roomID} tied (time up)`);
    }, (15 * 60 * 1000) + 3000);
  }
  
  socket.on('join_game', async ({ walletAddress, username, email }) => {
    console.log(`Player ${username} (${walletAddress}) wants to join a game.`);

    if (waitingPlayer) {
      await delay(3000);
      const opponentSocket = waitingPlayer.socket;
      const opponentUsername = waitingPlayer.username;
      const opponentWalletAddress = waitingPlayer.walletAddress;
      const opponentEmail = waitingPlayer.email;
      const [result] = await pool.query('SELECT max(id) AS maxId from games');
      const roomID = result[0].maxId + 1;
      const [ID] = await pool.query('SELECT id FROM users WHERE email = ?',[email]);
      const [opponentID] = await pool.query('SELECT id FROM users WHERE email = ?',[opponentEmail]);
      const [result4] = await pool.query(
              'INSERT INTO games (player1_id, player2_id, winner_id,stake_amount) VALUES (?, ?, ?, ?)',
              [ID[0].id, opponentID[0].id,0,0.001]
            );
      waitingPlayer = null;

      // Fetch a CP question from external API
      const res = await axios.get('http://localhost:8000/random_problem');
      
      loadingUsers.delete(email);
      loadingUsers.delete(opponentEmail);
      connectedUsers.set(email,roomID);
      connectedUsers.set(opponentEmail,roomID);

      io.to(socket.id).emit('game_start', {
        roomID,
        html: res.data.html,
        opponent: opponentUsername,
        opponentWalletAddress: opponentWalletAddress,
        problemID: res.id
      });

      io.to(opponentSocket.id).emit('game_start', {
        roomID,
        html: res.data.html,
        opponent: username,
        opponentWalletAddress: walletAddress,
        problemID: res.id
      });

      timer(roomID,walletAddress,opponentWalletAddress);

      console.log(`Game started in ${roomID}`);
    } else {
      waitingPlayer = {socket,username,walletAddress,email};
      console.log('Waiting for second player...');
    }
  });

  socket.on('joined_room', ({ roomID, email }) => {
    if(connectedUsers.get(email) && connectedUsers.get(email) !== roomID) return;
    connectedUsers.delete(email);
    socket.join(roomID);
    console.log(`Socket ${socket.id} joined room ${roomID}`);
  });

  socket.on('run_code', async ({ languageCode, code, input }) => {
    try {
      const res = await axios.post('http://localhost:8000/run', {
        languageCode,
        code,
        input
      });
      io.to(socket.id).emit('code_output', res.data.toString());
    } catch (err) {
      console.error('Error running code:', err.message || err);
    }
  });


  socket.on('submit_code', async ({ roomID, selectedLanguage, problemID, code, languageExtension, WalletAddress, OpponentWalletAddress }) => {
    const [result] = await pool.query('SELECT * FROM games where id = ?',[roomID]);
    console.log(result[0]);
    const game = result[0];
    
    if (!game || game.winner_id) return;

    try {
      const res = await axios.post('http://localhost:8000/submit', {
        problemID,
        selectedLanguage,
        code,
        languageExtension
      });
      console.log(res.data);
      if(res.data == "ACCEPTED"){
        const [ID] = await pool.query('SELECT id FROM users WHERE wallet_address = ?',[WalletAddress]);
        const [result] = await pool.query(
          'UPDATE games SET winner_id = ? WHERE id = ?',
          [ID[0].id, roomID]
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
app.use(passport.session());
// Route to start the authentication process
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route after Google authentication
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Generate JWT payload - you can customize this
        const payload = {
          username : req.user.username,
          email : req.user.email,
          wallet_address : null,
        };
        // Successful authentication, generate JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        // Redirect to the external website with the JWT as a query parameter
        res.redirect(`http://localhost:5000/setjwt?token=${token}`); // Change to your desired URL
    }
);

app.post('/verify-token', (req,res) => { // type-1 is basic, type-2 is loading, type-3 is gaming
  const { type } = req.body;
  const token = req.cookies.jwt;
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


app.post('/auth/metamask', async (req, res) => {
  const { address } = req.body;
  const token = req.cookies.jwt;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    if(decoded && decoded.email){
      const [result] = await pool.query(
              'UPDATE users SET wallet_address = ? WHERE email = ?',
              [address,decoded.email]
            );
      const payload = {
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
  const token = req.cookies.jwt;
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
    });
    console.log("Loading users: ",loadingUsers);
    console.log("Transaction Hashes: ",txHashes);
    res.status(200).json({ message: 'Loading started' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/data', async (req, res) => {
  let userreq;
  userreq = req.query.username;
  const token = req.cookies.jwt;
  let userdata;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  const user = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [userdata.email]
  );
  if(userreq){
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
      [user[0][0].id,user[0][0].id,user[0][0].id]
    );
    data.push({
      id: user[0][0].id,
      username: userdata.username,
      email: userdata.email,
      wallet_address: userdata.wallet_address
    });
    res.json(data);
  }
  else{
    let [data]  = await pool.query(
      'SELECT * FROM games WHERE player1_id = ? OR player2_id = ?',
      [user[0][0].id,user[0][0].id]
    );
    data.push({
      id: user[0][0].id,
      username: userdata.username,
      email: userdata.email,
      wallet_address: userdata.wallet_address
    });
    res.json(data);
  }
});

app.get('/get-friends', async (req, res) => {
  let userdata;
  const token = req.cookies.jwt;
  if (!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  const user = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [userdata.email]
  );
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
    [user[0][0].id,user[0][0].id,user[0][0].id]
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
    [user[0][0].id] 
  );
  res.json({
    "Friends" : data,
    "FriendsRequests" : data2
  });
});

app.post('/search-friends', async (req, res) => {
  let userdata;
  const { searchQuery } = req.body;
  const token = req.cookies.jwt;
  if (!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  const user = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [userdata.email]
  );
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
    [user[0][0].id,searchQuery,searchQuery,searchQuery,user[0][0].id,user[0][0].id,user[0][0].id]
  );
  res.json(data);
});

app.post('/request-friend', async (req, res) => {
  let userdata;
  const { requestId , value } = req.body;
  const token = req.cookies.jwt;
  if (!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  const user = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [userdata.email]
  );

  if(value){
    await pool.query(
      'UPDATE friends SET status = TRUE WHERE requester_id = ? AND addressee_id = ?',
      [requestId, user[0][0].id]
    );
  }
  else {
    await pool.query(
      'DELETE FROM friends WHERE requester_id = ? AND addressee_id = ?',
      [requestId, user[0][0].id]
    );
  }
  res.send("Done!");
});

app.post('/add-friend', async (req, res) => {
  let userdata;
  const { FriendId } = req.body;
  const token = req.cookies.jwt;
  if (!token) return res.status(400).json({ status: 0, error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    userdata = decoded;
  });

  const user = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [userdata.email]
  );

  const [result] = await pool.query(
    'SELECT * FROM friends WHERE requester_id = ? AND addressee_id = ?',
    [FriendId,user[0][0].id]
  );
  if(result.length > 0){
    await pool.query(
      'UPDATE friends SET status = TRUE WHERE requester_id = ? AND addressee_id = ?',
      [FriendId, user[0][0].id]
    );
  }
  else {
    await pool.query(
      'INSERT INTO friends (requester_id, addressee_id, status) VALUES (?, ?, FALSE)',
      [user[0][0].id, FriendId]
    );
  }
  res.send("Done!");
});

app.get('/', (req, res) => {
  console.log("Loading users: ",loadingUsers);
  console.log("Connected users: ",connectedUsers);
  console.log("Transaction Hashes: ",txHashes);
  res.send('Hello from Express!');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
