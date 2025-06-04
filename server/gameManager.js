const games = {};

function createGame(roomID, player1, player2, io) {
  games[roomID] = {
    players: [player1, player2],
    submissions: {},
    isOver: false,
    timer: setTimeout(() => {
      if (!games[roomID].isOver) {
        io.to(roomID).emit('game_tied');
        games[roomID].isOver = true;
        console.log(`⏱ Game in ${roomID} tied (time up)`);
      }
    }, 45 * 60 * 1000),
  };
}

async function submitSolution(io, roomID, socketID, code) {
  const game = games[roomID];
  if (!game || game.isOver) return;

  // Simulate code checking – here, just mark first submission as winner
  if (!game.submissions[socketID]) {
    game.submissions[socketID] = code;

    // Declare winner
    game.isOver = true;
    clearTimeout(game.timer);
    io.to(roomID).emit('game_won', { winnerId: socketID });

    console.log(`✅ Game in ${roomID} won by ${socketID}`);
  }
}

module.exports = {
  createGame,
  submitSolution,
};
