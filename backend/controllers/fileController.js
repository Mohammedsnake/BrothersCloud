const FileModel = require('../models/fileModel');
const path = require('path');
const fs = require('fs');

// ======================= UPLOAD FILE =======================
exports.uploadFile = async (req, res) => {
  try {
    const user_id = req.user.user_id; // from JWT
    const file_type_raw = req.body.file_type || '';
    const file_name = req.body.file_name;
    const file_description = req.body.file_description || '';

    const file_type = file_type_raw.trim().toLowerCase();

    // Validate required fields
    if (!file_type || !file_name) {
      return res.status(400).json({ message: 'file_type and file_name are required' });
    }

    if (!req.file && file_type !== 'event') {
      return res.status(400).json({ message: 'File is required' });
    }

    console.log('[Upload] Received file:', req.file);
    console.log('[Upload] Body:', req.body);

    let relPath = null;
    let absPath = null;
    let file_size = null;

    if (req.file && file_type !== 'event') {
      // Determine folder based on file type
      const subfolder = file_type === 'image'
        ? 'images'
        : file_type === 'document'
        ? 'documents'
        : 'videos';

      relPath = path.posix.join('/uploads', subfolder, req.file.filename);
      absPath = path.join(process.cwd(), 'uploads', subfolder, req.file.filename);

      // Get file size safely
      try {
        if (fs.existsSync(absPath)) {
          const stats = fs.statSync(absPath);
          file_size = stats.size;
        } else {
          console.warn(`[Upload] File not found on disk: ${absPath}`);
        }
      } catch (err) {
        console.warn(`[Upload] Cannot read file size for ${absPath}:`, err.message);
      }
    }

    // Insert into database
    const id = await FileModel.create({
      user_id,
      file_type,
      file_name,
      file_description,
      file_path: relPath,
      file_size
    });

    console.log('[Upload] Inserted file ID:', id);

    // Fetch newly created file with size & uploaded_at
    const newFile = await FileModel.getById(id);

    return res.status(201).json({
      message: 'File uploaded successfully',
      file: newFile
    });
  } catch (err) {
    console.error('[Upload Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ======================= GET ALL FILES =======================
exports.getFiles = async (req, res) => {
  try {
    const files = await FileModel.getAll(req.query);
    return res.json(files);
  } catch (err) {
    console.error('[Get Files Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ======================= GET SINGLE FILE METADATA =======================
exports.getFileById = async (req, res) => {
  try {
    const file = await FileModel.getById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    return res.json(file);
  } catch (err) {
    console.error('[Get File Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ======================= VIEW FILE (INLINE PREVIEW) =======================
exports.viewFile = async (req, res) => {
  try {
    const file = await FileModel.getById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.file_path) return res.status(400).json({ message: 'This file type has no stored content' });

    const absPath = path.join(process.cwd(), file.file_path.replace(/^\//, ''));
    return res.sendFile(absPath, (err) => {
      if (err) {
        console.error('[View File Error]', err);
        if (!res.headersSent) res.status(500).json({ message: 'Error serving file' });
      }
    });
  } catch (err) {
    console.error('[View Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ======================= DOWNLOAD FILE =======================
exports.downloadFile = async (req, res) => {
  try {
    const file = await FileModel.getById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.file_path) return res.status(400).json({ message: 'This file type has no stored content' });

    const absPath = path.join(process.cwd(), file.file_path.replace(/^\//, ''));
    return res.download(absPath, file.file_name, (err) => {
      if (err) {
        console.error('[Download File Error]', err);
        if (!res.headersSent) res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (err) {
    console.error('[Download Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ======================= DELETE FILE =======================
exports.deleteFile = async (req, res) => {
  try {
    const filePath = await FileModel.delete(req.params.id);
    if (!filePath) return res.status(404).json({ message: 'File not found' });

    if (filePath) {
      const abs = path.join(process.cwd(), filePath.replace(/^\//, ''));
      fs.unlink(abs, (fsErr) => {
        if (fsErr && fsErr.code !== 'ENOENT') {
          console.warn('[Delete File Error]', fsErr.message);
        }
      });
    }

    return res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('[Delete Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
