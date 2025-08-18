// config/db.js
require('dotenv').config(); // Load environment variables
const mysql = require('mysql2');

// Create MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brotherscloud',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Check your DB_USER and DB_PASSWORD in .env');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('Database does not exist. Check DB_NAME in .env');
    }
  } else {
    console.log('✅ MySQL Connected Successfully');
    connection.release();
  }
});

// Export promise-based pool for async/await
module.exports = pool.promise();
