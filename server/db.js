const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'localhost',       // Since MySQL is on your machine
  user: 'nebula',
  password: 'Me-you=0',
  database: 'nebula_project',
  waitForConnections: true
});

module.exports = pool.promise();
