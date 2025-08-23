// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// 🔹 Setup Multer for temporary storage before uploading to Cloudinary
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ✅ Protect all routes (user must be authenticated)
router.use(authMiddleware);

/**
 * @route   POST /api/files
 * @desc    Upload a new file to Cloudinary
 * @access  Private
 * @field   form-data: 'file'
 */
router.post('/', upload.single('file'), fileController.uploadFile);

/**
 * @route   GET /api/files
 * @desc    Get all files (with optional filters: type, q, user_id)
 * @access  Private
 */
router.get('/', fileController.getFiles);

/**
 * @route   GET /api/files/:id/view
 * @desc    View/preview a file directly in the browser
 *          - Images, PDFs, Videos → open inline
 *          - Word/Excel/Other docs → fallback download
 * @access  Private
 */
router.get('/:id/view', fileController.viewFile);

/**
 * @route   GET /api/files/:id/download
 * @desc    Force download of a file by ID
 * @access  Private
 */
router.get('/:id/download', fileController.downloadFile);

/**
 * @route   DELETE /api/files/:id
 * @desc    Delete a file by ID (and also remove from Cloudinary)
 * @access  Private
 */
router.delete('/:id', fileController.deleteFile);

module.exports = router;
