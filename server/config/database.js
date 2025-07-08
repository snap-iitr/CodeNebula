const mysql = require('mysql2');
const { DB } = require('./index');
module.exports = mysql.createPool(DB).promise();
