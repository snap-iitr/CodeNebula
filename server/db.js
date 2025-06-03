const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',       // Since MySQL is on your machine
  user: 'nebula',
  password: process.env.DATABASE_PASSWORD,
  database: 'nebula_project',
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