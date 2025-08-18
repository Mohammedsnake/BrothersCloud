const db = require('../config/db');
const bcrypt = require('bcryptjs');

class UserModel {
  // Find user by names
  static async findByName(first_name, middle_name, last_name) {
    const [rows] = await db.query(
      `SELECT user_id, first_name, middle_name, last_name, password_hash
       FROM users
       WHERE first_name = ? AND (middle_name <=> ?) AND last_name = ?`,
      [first_name, middle_name || null, last_name]
    );
    return rows[0] || null;
  }

  // Create user
  static async create({ first_name, middle_name, last_name, password }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (first_name, middle_name, last_name, password_hash)
       VALUES (?, ?, ?, ?)`,
      [first_name, middle_name || null, last_name, hash]
    );
    return result.insertId;
  }

  // Get all users
  static async getAll() {
    const [rows] = await db.query(`SELECT user_id, first_name, middle_name, last_name FROM users`);
    return rows;
  }
}

module.exports = UserModel;
