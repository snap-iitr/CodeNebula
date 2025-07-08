require('dotenv').config();
module.exports = {
  PORT: process.env.PORT || 3000,
  CLIENT_API_URL: process.env.CLIENT_API_URL,
  ADMIN_WALLET_ADDRESS: process.env.ADMIN_WALLET_ADDRESS,
  SEPOLIA_ETHERSCAN_API: process.env.SEPOLIA_ETHERSCAN_API,
  SEPOLIA_ALCHEMY_API_URL: process.env.SEPOLIA_ALCHEMY_API_URL,
  PYTHON_API_URL: process.env.PYTHON_API_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  DB: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true
  },
};
