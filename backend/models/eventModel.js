const db = require('../config/db');

class EventModel {
  static async create({ user_id, event_date, event_name, event_description, repetition }) {
    const [result] = await db.query(
      `INSERT INTO events (user_id, event_date, event_name, event_description, repetition)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, event_date, event_name, event_description || null, repetition || 'once']
    );
    return result.insertId;
  }

  static async getAll({ from, to, q, user_id }) {
    const clauses = [];
    const params = [];

    if (from) { clauses.push('event_date >= ?'); params.push(from); }
    if (to) { clauses.push('event_date <= ?'); params.push(to); }
    if (q) { clauses.push('event_name LIKE ?'); params.push(`%${q}%`); }
    if (user_id) { clauses.push('user_id = ?'); params.push(user_id); }

    let sql = `SELECT * FROM events`;
    if (clauses.length) sql += ` WHERE ` + clauses.join(' AND ');
    sql += ` ORDER BY event_date DESC`;

    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async update(id, fields) {
    const keys = Object.keys(fields);
    if (!keys.length) return false;

    const setStr = keys.map(k => `${k} = ?`).join(', ');
    const params = keys.map(k => fields[k]);
    params.push(id);

    await db.query(`UPDATE events SET ${setStr} WHERE event_id = ?`, params);
    return true;
  }

  static async delete(id) {
    const [result] = await db.query(`DELETE FROM events WHERE event_id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = EventModel;
