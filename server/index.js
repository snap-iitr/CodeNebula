const express = require('express');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cors = require('cors'); // Import the cors package
const PORT = process.env.PORT || 3000;
require('./google')
const app = express();
app.use(express.json());
// const { Server } = require('socket.io');
// const http = require('http');
// const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:5000'
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
          name: req.user.display_name,
          user: req.user.email,
          address: null
        };
        // Successful authentication, generate JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        // Redirect to the external website with the JWT as a query parameter
        res.redirect(`http://localhost:5000/setjwt?token=${token}`); // Change to your desired URL
    }
);

app.post('/verify-token', (req,res) => {

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ status: 0, error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    if(decoded.user && decoded.address) res.json({ status: 2 });
    else if(decoded.user) res.json({ status: 1 });
    else res.json({ status: 0 });
  });
});


app.post('/auth/metamask', async (req, res) => {
  const { token , address } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 0, error: 'Invalid token' });
    }
    if(decoded.user){
      const [result] = await pool.query(
              'UPDATE users SET address = ? WHERE email = ?',
              [address,decoded.user]
            );
      const payload = {
          name: decoded.name,
          user: decoded.user,
          address: address
        };
        // Successful authentication, generate JWT
        const new_token = jwt.sign(payload, process.env.JWT_SECRET);
        res.send(new_token);
    }
    else res.status(400).json({ error: 'No user in token' });
  });
});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
