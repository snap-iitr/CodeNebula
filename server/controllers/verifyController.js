const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { connectedUsers, loadingUsers } = require('../utils/gameState');

exports.verifyToken = (req, res) => {
  const { type } = req.body;
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ status:0, error:'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ status:0, error:'Invalid token' });
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
};

exports.verifyProfile = (req, res) => {
  const { UserId } = req.body;
  const token = req.headers.authorization;
  if (!token || !UserId) return res.status(400).json({status: 0});

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
};
