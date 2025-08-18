const db = require('../config/db');

class SearchModel {
  static async searchAll(q, limit = 50, offset = 0) {
    const like = `%${q}%`;
    const [rows] = await db.query(
      `(
         SELECT 'file' AS item_type, file_id AS id, file_name AS title, file_description AS description,
                file_type, file_path, uploaded_at AS date
         FROM files
         WHERE file_name LIKE ? OR file_description LIKE ?
       )
       UNION ALL
       (
         SELECT 'event' AS item_type, event_id AS id, event_name AS title, event_description AS description,
                repetition, NULL AS file_path, event_date AS date
         FROM events
         WHERE event_name LIKE ? OR event_description LIKE ?
       )
       ORDER BY date DESC
       LIMIT ? OFFSET ?`,
      [like, like, like, like, Number(limit), Number(offset)]
    );
    return rows;
  }

  static async searchFiles(q, limit = 50, offset = 0) {
    const like = `%${q}%`;
    const [rows] = await db.query(
      `SELECT 'file' AS item_type, file_id AS id, file_name AS title, file_description AS description,
              file_type, file_path, uploaded_at AS date
       FROM files
       WHERE file_name LIKE ? OR file_description LIKE ?
       ORDER BY uploaded_at DESC
       LIMIT ? OFFSET ?`,
      [like, like, Number(limit), Number(offset)]
    );
    return rows;
  }

  static async searchEvents(q, limit = 50, offset = 0) {
    const like = `%${q}%`;
    const [rows] = await db.query(
      `SELECT 'event' AS item_type, event_id AS id, event_name AS title, event_description AS description,
              repetition, event_date AS date
       FROM events
       WHERE event_name LIKE ? OR event_description LIKE ?
       ORDER BY event_date DESC
       LIMIT ? OFFSET ?`,
      [like, like, Number(limit), Number(offset)]
    );
    return rows;
  }
}

module.exports = SearchModel;
