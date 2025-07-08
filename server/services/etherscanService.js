const axios = require('axios');
const { SEPOLIA_ETHERSCAN_API, ADMIN_WALLET_ADDRESS } = require('../config');
const SEPOLIA_API_URL = 'https://api-sepolia.etherscan.io/api';

async function verifyFundTx(txHash) {
  const res = await axios.get(SEPOLIA_API_URL, {
    params: {
      module: 'proxy',
      action: 'eth_getTransactionByHash',
      txhash: txHash,
      apikey: SEPOLIA_ETHERSCAN_API,
    }
  });
  const tx = res.data.result;
  return tx &&
      tx.to.toLowerCase() === ADMIN_WALLET_ADDRESS.toLowerCase() &&
      parseFloat(tx.value) >= 1e15; // 0.001 ETH in Wei
}

module.exports = { verifyFundTx };
