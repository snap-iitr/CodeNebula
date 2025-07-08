const { ethers } = require('ethers');
const { SEPOLIA_ALCHEMY_API_URL } = require('../config');

async function sendTransaction(to, amount, privateKey) {
  const provider = new ethers.JsonRpcProvider(SEPOLIA_ALCHEMY_API_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount),
  });
  await tx.wait();
  return tx.hash;
}

module.exports = { sendTransaction };
