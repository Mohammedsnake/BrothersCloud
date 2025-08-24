const db = require('../config/db');

const FileModel = {
  // ======================= CREATE FILE =======================
  create: async ({ 
    user_id, 
    file_type, 
    file_name, 
    file_description, 
    file_path,       // legacy field (kept for compatibility)
    file_size, 
    cloud_id, 
    cloudinary_url,   // ✅ new field
    mime_type         // ✅ NEW
  }) => {
    const [result] = await db.query(
      `INSERT INTO files 
        (user_id, file_type, file_name, file_description, file_path, file_size, cloud_id, cloudinary_url, mime_type, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        user_id, 
        file_type, 
        file_name, 
        file_description, 
        file_path, 
        file_size || 0, 
        cloud_id, 
        cloudinary_url,
        mime_type || null
      ]
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

    return rows.map(file => ({
      ...file,
      file_size: file.file_size || 0,
      uploaded_at: file.uploaded_at ? new Date(file.uploaded_at) : new Date(),
      cloudinary_url: file.cloudinary_url || null,
      mime_type: file.mime_type || null
    }));
  },

  // ======================= GET FILE BY ID =======================
  getById: async (file_id) => {
    const [rows] = await db.query(
      `SELECT * FROM files WHERE file_id = ?`,
      [file_id]
    );
    if (!rows.length) return null;

    const file = rows[0];
    return {
      ...file,
      file_size: file.file_size || 0,
      uploaded_at: file.uploaded_at ? new Date(file.uploaded_at) : new Date(),
      cloudinary_url: file.cloudinary_url || null,
      mime_type: file.mime_type || null
    };
  },

  // ======================= DELETE FILE =======================
  delete: async (file_id) => {
    const [rows] = await db.query(
      `SELECT file_path, cloud_id, cloudinary_url, mime_type FROM files WHERE file_id = ?`,
      [file_id]
    );
    if (!rows.length) return null;

    const fileData = rows[0];
    await db.query(`DELETE FROM files WHERE file_id = ?`, [file_id]);
    return fileData; // ✅ return cloud + mime info for cleanup
  }
};

module.exports = FileModel;
