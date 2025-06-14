const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true
});

module.exports = pool.promise();


// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(50) NOT NULL UNIQUE,
//     email VARCHAR(100) NOT NULL UNIQUE,
//     wallet_address VARCHAR(255),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
// CREATE TABLE games (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     player1_id INT NOT NULL,
//     player2_id INT NOT NULL,
//     winner_id INT NOT NULL,
//     stake_amount DECIMAL(10, 3) NOT NULL,
//     completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (player1_id) REFERENCES users(id),
//     FOREIGN KEY (player2_id) REFERENCES users(id)
// );
// CREATE TABLE friends (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     requester_id INT NOT NULL,
//     addressee_id INT NOT NULL,
//     status BOOLEAN DEFAULT FALSE,
//     FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
//     FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE
// );
