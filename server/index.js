const express = require('express');
const { formatEther } = require("ethers");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cors = require('cors');
const axios = require("axios");
const PORT = process.env.PORT || 3000;
const { createGame, submitSolution } = require('./gameManager');
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

// Handle player connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_game', async ({ walletAddress, username }) => {
    console.log(`Player ${username} (${walletAddress}) wants to join a game.`);

    if (waitingPlayer) {
      await delay(3000);
      const opponentSocket = waitingPlayer.socket;
      const opponentUsername = waitingPlayer.username;
      const [result] = await pool.query('SELECT max(id) AS maxId from games');
      console.log(`Max game ID: ${result[0].maxId}`);
      const roomID = result[0].maxId + 1;
      waitingPlayer = null;

      // Join both sockets to the same room
      socket.join(roomID);
      opponentSocket.join(roomID);

      // Fetch a CP question from external API
      let questionHtml = '';
      const res = await axios.get('http://localhost:8000/random_problem');
      console.log(res.data);
      questionHtml = res.data;

      // Start the game
      createGame(roomID, socket.id, opponentSocket.id, io);
      console.log(questionHtml.html);

      io.to(socket.id).emit('game_start', {
        roomID,
        html: questionHtml.html,
        opponent: opponentUsername
      });

      io.to(opponentSocket.id).emit('game_start', {
        roomID,
        html: questionHtml.html,
        opponent: username
      });

      console.log(`Game started in ${roomID}`);
    } else {
      waitingPlayer = {socket,username,walletAddress};
      console.log('Waiting for second player...');
    }
  });

  socket.on('joined_room', ({ roomID }) => {
    socket.join(roomID);
    console.log(`Socket ${socket.id} joined room ${roomID}`);
  });


  socket.on('submit_solution', async ({ roomID, fileData, username }) => {
    console.log(`📤 Submission from ${username} in ${roomID}`);
    await submitSolution(io, roomID, socket.id, fileData);
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
          gaming: false
        };
        // Successful authentication, generate JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        // Redirect to the external website with the JWT as a query parameter
        res.redirect(`http://localhost:5000/setjwt?token=${token}`); // Change to your desired URL
    }
);

app.post('/verify-token', (req,res) => { // type-1 is basic, type-2 is gaming
  const { type } = req.body;
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(400).json({ status: 0, error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    if(type == '2'){
      if(decoded.gaming) res.json({ status: 1 });
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
          gaming: false
        };
        // Successful authentication, generate JWT
        const new_token = jwt.sign(payload, process.env.JWT_SECRET);
        res.send(new_token);
    }
    else res.status(400).json({ error: 'No user in token' });
  });
});

app.post('/set-gaming', async (req, res) => {
  const { txHash } = req.body;
  console.log(txHash);
  const token = req.cookies.jwt;
  if (!txHash || !token) return res.status(400).json({ error: 'Provide all things!!' });
  
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
        const payload = {
            username : decoded.username,
            email : decoded.email,
            wallet_address : decoded.wallet_address,
            gaming: true
          };
          // Successful authentication, generate JWT
          const new_token = jwt.sign(payload, process.env.JWT_SECRET);
          res.send(new_token);
      }
      else res.status(400).json({ error: 'No user in token' });
    });
  }
  catch (err) {
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

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
