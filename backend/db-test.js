require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,      // e.g., hopper.proxy.rlwy.net
      user: process.env.DB_USER,      // e.g., root
      password: process.env.DB_PASS,  // your password
      database: process.env.DB_NAME,  // railway
      port: Number(process.env.DB_PORT) // 52447
    });

    console.log('✅ MySQL Connected Successfully!');
    await connection.end();
  } catch (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
  }
}

testDB();
