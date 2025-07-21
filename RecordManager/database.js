const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "",
  user: "", // or your MySQL username
  password: "",
  database: "",
  port: 3306, // default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
