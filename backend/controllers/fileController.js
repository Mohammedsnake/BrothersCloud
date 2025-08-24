// controllers/fileController.js
const FileModel = require('../models/fileModel');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const mime = require('mime-types'); // ✅ helps detect MIME type

// 🔹 Cloudinary Config (uses environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    let file_url = null;
    let public_id = null;
    let file_size = null;
    let mime_type = null;

    if (req.file && file_type !== 'event') {
      // 🔹 Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder:
          file_type === 'image'
            ? 'brotherscloud/images'
            : file_type === 'document'
            ? 'brotherscloud/documents'
            : 'brotherscloud/videos',
        resource_type: 'auto', // auto-detect type
      });

      file_url = uploadResult.secure_url; // ✅ Cloudinary link
      public_id = uploadResult.public_id; // ✅ Cloudinary ID
      file_size = req.file.size;
      mime_type = req.file.mimetype;

      // Remove temp file
      fs.unlink(req.file.path, () => {});
    }

    // Insert into database
    const id = await FileModel.create({
      user_id,
      file_type,
      file_name,
      file_description,
      file_path: null, // legacy field
      file_size,
      cloud_id: public_id,
      cloudinary_url: file_url, // ✅ main field
      mime_type,
    });

    console.log('[Upload] Inserted file ID:', id);

    const newFile = await FileModel.getById(id);

    return res.status(201).json({
      message: 'File uploaded successfully',
      file: newFile,
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

// ======================= VIEW FILE =======================
exports.viewFile = async (req, res) => {
  try {
    const file = await FileModel.getById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (!file.cloudinary_url) return res.status(400).json({ message: 'This file has no content' });

    const mimeType = file.mime_type || mime.lookup(file.file_name) || 'application/octet-stream';

    // ✅ Let browser display inline (image, PDF, video)
    if (
      mimeType.startsWith('image/') ||
      mimeType === 'application/pdf' ||
      mimeType.startsWith('video/')
    ) {
      res.setHeader('Content-Type', mimeType);
      return res.redirect(file.cloudinary_url);
    }

    // ❌ For other docs (Word, Excel etc.), force download
    res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`);
    return res.redirect(file.cloudinary_url);

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
    if (!file.cloudinary_url) return res.status(400).json({ message: 'This file has no content' });

    const mimeType = file.mime_type || mime.lookup(file.file_name) || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.file_name}"`);
    return res.redirect(file.cloudinary_url);
  } catch (err) {
    console.error('[Download Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ======================= DELETE FILE =======================
exports.deleteFile = async (req, res) => {
  try {
    const file = await FileModel.getById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // 🔹 Delete from Cloudinary if exists
    if (file.cloud_id) {
      await cloudinary.uploader.destroy(file.cloud_id, { resource_type: 'auto' });
    }

    await FileModel.delete(req.params.id);

    return res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('[Delete Error]', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
