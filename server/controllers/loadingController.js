const { verifyFundTx } = require('../services/etherscanService');
const { loadingUsers, txHashes } = require('../utils/gameState');

exports.setLoading = async (req, res) => {
  const { txHash } = req.body;
  if (!txHash || txHashes.has(txHash)) return res.status(400).json({ error: 'No hash' });
  // check for valid transaction
  const valid = await verifyFundTx(txHash);
  if (!valid) return res.status(400).json({ error: 'Invalid TX' });
  // add user to loading set
  const user = req.user;
  if(user && user.email && user.wallet_address){
    loadingUsers.add(decoded.email);
    txHashes.add(txHash);
    res.json({ message:'Loading started' });
  }
  else res.status(401).json({ status: 0, error: 'Invalid token' });
};
