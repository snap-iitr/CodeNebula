const loadingUsers = new Set(); // loading_userId
const connectedUsers = new Map(); // connected_userId
const roomIDs = new Set(); // Ongoing Game RoomIDs
const txHashes = new Set(); // txHash

module.exports = {
  connectedUsers,
  loadingUsers,
  roomIDs,
  txHashes
};
