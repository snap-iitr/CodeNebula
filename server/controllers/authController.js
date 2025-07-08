const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { JWT_SECRET } = require('../config');

exports.googleCallback = (req, res) => {
  const { id, username, email } = req.user;
  const token = jwt.sign({ id, username, email, wallet_address: null }, JWT_SECRET);
  res.redirect(`${process.env.CLIENT_API_URL}/setjwt?token=${token}`);
};

exports.metamaskAuth = async (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ status:0, error:'Invalid token' });
    const { address } = req.body;
    await pool.query('UPDATE users SET wallet_address = ? WHERE email = ?', [address, decoded.email]);
    const newToken = jwt.sign({ ...decoded, wallet_address: address }, JWT_SECRET);
    res.send(newToken);
  });
};
