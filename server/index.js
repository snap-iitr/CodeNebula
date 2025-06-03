const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cors = require('cors'); // Import the cors package
const PORT = process.env.PORT || 3000;
require('./google')
const app = express();
app.use(express.json());
app.use(cookieParser());
// const { Server } = require('socket.io');
// const http = require('http');
// const server = http.createServer(app);

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
          wallet_address : null
        };
        // Successful authentication, generate JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        // Redirect to the external website with the JWT as a query parameter
        res.redirect(`http://localhost:5000/setjwt?token=${token}`); // Change to your desired URL
    }
);

app.post('/verify-token', (req,res) => {

  const token = req.cookies.jwt;

  if (!token) {
    return res.status(400).json({ status: 0, error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    if(decoded.email && decoded.wallet_address) res.json({ status: 2 });
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
          wallet_address : address
        };
        // Successful authentication, generate JWT
        const new_token = jwt.sign(payload, process.env.JWT_SECRET);
        res.send(new_token);
    }
    else res.status(400).json({ error: 'No user in token' });
  });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
