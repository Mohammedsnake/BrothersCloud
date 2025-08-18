const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const FileModel = {
  // ======================= CREATE FILE =======================
  create: async ({ user_id, file_type, file_name, file_description, file_path, file_size }) => {
    const [result] = await db.query(
      `INSERT INTO files (user_id, file_type, file_name, file_description, file_path, file_size, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [user_id, file_type, file_name, file_description, file_path, file_size || 0]
    );
    return result.insertId;
  },

  // ======================= GET ALL FILES =======================
  getAll: async ({ file_type, q, user_id }) => {
    let sql = `SELECT * FROM files WHERE 1=1`;
    const params = [];

    if (file_type) {
      sql += ` AND file_type = ?`;
      params.push(file_type);
    }

    if (q) {
      sql += ` AND file_name LIKE ?`;
      params.push(`%${q}%`);
    }

    if (user_id) {
      sql += ` AND user_id = ?`;
      params.push(user_id);
    }

    sql += ` ORDER BY uploaded_at DESC`;

    const [rows] = await db.query(sql, params);

    // Compute file_size dynamically if missing
    const filesWithSize = rows.map(file => {
      let fileSize = file.file_size || 0;
      if ((!fileSize || fileSize === 0) && file.file_path) {
        const fileFullPath = path.join(__dirname, '..', file.file_path);
        try {
          if (fs.existsSync(fileFullPath)) {
            fileSize = fs.statSync(fileFullPath).size;
          }
        } catch (err) {
          console.warn(`[FileModel] Cannot read file size for ${fileFullPath}:`, err.message);
        }
      }

      return {
        ...file,
        file_size: fileSize,
        uploaded_at: file.uploaded_at ? new Date(file.uploaded_at) : new Date()
      };
    });

    return filesWithSize;
  },

  // ======================= GET FILE BY ID =======================
  getById: async (file_id) => {
    const [rows] = await db.query(
      `SELECT * FROM files WHERE file_id = ?`,
      [file_id]
    );
    if (!rows.length) return null;

    const file = rows[0];
    let fileSize = file.file_size || 0;

    if ((!fileSize || fileSize === 0) && file.file_path) {
      const fileFullPath = path.join(__dirname, '..', file.file_path);
      try {
        if (fs.existsSync(fileFullPath)) {
          fileSize = fs.statSync(fileFullPath).size;
        }
      } catch (err) {
        console.warn(`[FileModel] Cannot read file size for ${fileFullPath}:`, err.message);
      }
    }

    return {
      ...file,
      file_size: fileSize,
      uploaded_at: file.uploaded_at ? new Date(file.uploaded_at) : new Date()
    };
  },

  // ======================= DELETE FILE =======================
  delete: async (file_id) => {
    const [rows] = await db.query(
      `SELECT file_path FROM files WHERE file_id = ?`,
      [file_id]
    );
    if (!rows.length) return null;

    const filePath = rows[0].file_path;
    await db.query(`DELETE FROM files WHERE file_id = ?`, [file_id]);
    return filePath;
  }
};

module.exports = FileModel;
