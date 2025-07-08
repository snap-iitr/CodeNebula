const express = require('express');
const http = require('http');
const cors = require('cors');
const passport = require('passport');
require('./config/groq');
require('./config/google');

const { PORT, CLIENT_API_URL } = require('./config');
const authRoutes = require('./routes/auth');
const verifyRoutes = require('./routes/verify');
const loadingRoutes = require('./routes/loading');
const friendsRoutes = require('./routes/friends');
const dataRoutes = require('./routes/data');
const errorHandler = require('./middlewares/errorHandler');
const socketManager = require('./utils/socketManager');
const pool = require('./config/database');

const app = express();
app.use(express.json());
app.use(cors({ origin: CLIENT_API_URL }));
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/', verifyRoutes);
app.use('/set-loading', loadingRoutes);
app.use('/', friendsRoutes);
app.use('/', dataRoutes);
app.use(errorHandler);

app.get('/test', (req, res) => {
  console.log("Loading users: ",loadingUsers);
  console.log("Connected users: ",connectedUsers);
  console.log("Transaction Hashes: ",txHashes);
  res.send("Go Away! It's a top secret place");
});

const server = http.createServer(app);
const io = require('socket.io')(server, { cors:{ origin: CLIENT_API_URL, credentials:true }});
socketManager(io, pool);

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
