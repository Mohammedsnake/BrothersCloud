// import-db-clean.js
require('dotenv').config();
const fs = require('fs');
const pool = require('./config/db');

let sql = fs.readFileSync('brotherscloud.sql', 'utf8');

// Remove empty statements and MariaDB comments
sql = sql
  .replace(/;\s*;\s*;\s*;\s*;\s*;\s*;\s*;\s*;\s*;\s*;\s*;\s*/g, ';') // remove multiple empty ;
  .replace(/--.*\r?\n/g, '') // remove comments
  .replace(/\/\*![0-9]{5} .*?\*\//gs, ''); // remove versioned MariaDB comments

// Split statements by semicolon
const statements = sql
  .split(/;\s*\n/)   // split at ; + newline
  .map(s => s.trim())
  .filter(s => s.length > 0); // remove empty strings

async function importSQL() {
  try {
    for (const stmt of statements) {
      await pool.query(stmt);
    }
    console.log('✅ Database imported successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error importing SQL:', err);
  }
}

importSQL();
