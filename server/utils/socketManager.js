const jwt = require('jsonwebtoken');
const axios = require('axios');
const { runCode, submitCode } = require('../services/codeExecutionService');
const { sendTransaction } = require('../services/transactionService')
const { getHint } = require('../services/hintService');
const delay = require('./delay');
const  { loadingUsers, connectedUsers, roomIDs} = require('./gameState')

function authenticateSocket(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token provided'));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Invalid token'));
    socket.user = decoded;
    next();
  });
}

function socketManager(io) {
  io.use(authenticateSocket);
  var waitingPlayer = null;

  // Handle player connections
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    function timer(roomID, wallet_address, opponentWalletAddress){
      setTimeout(() => {
        if(roomIDs.has(roomID)){
          io.to(roomID).emit('game_tied');
          sendTransaction(wallet_address.toString(),"0.0009");
          sendTransaction(opponentWalletAddress.toString(),"0.0009");
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
      const hint = await getHint(html, chatMessage);
      io.to(socket.id).emit('hint_response',hint);
    });
  
    socket.on('run_code', async ({ languageCode, code, input }) => {
      const output = await runCode( languageCode, code, input );
      io.to(socket.id).emit('code_output', output);
    });
  
  
    socket.on('submit_code', async ({ roomID, selectedLanguage, problemID, code, languageExtension, WalletAddress, OpponentWalletAddress, Id }) => {
      roomIDs.delete(roomID);
      const [result] = await pool.query('SELECT * FROM games where id = ?',[roomID]);
      console.log(result[0]);
      const game = result[0];
      
      if (!game || game.winner_id) return;
  
      try {
        const res = await submitCode( problemID, selectedLanguage, code, languageExtension );
        if(res == "ACCEPTED"){
          await pool.query(
            'UPDATE games SET winner_id = ? WHERE id = ?',
            [Id, roomID]
          );
          sendTransaction(WalletAddress.toString(),"0.0018");
        }
        else sendTransaction(OpponentWalletAddress.toString(),"0.0011");
  
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
}

module.exports = socketManager;
