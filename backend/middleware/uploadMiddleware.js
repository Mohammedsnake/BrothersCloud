const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[Multer] Created directory: ${dir}`);
  }
};

const allowedMime = {
  image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  video: [
    'video/mp4',
    'video/mkv',
    'video/x-matroska',
    'video/avi',
    'video/x-msvideo',
    'video/webm',
    'video/quicktime'
  ]
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const file_type = (req.body.file_type || '').trim().toLowerCase();
    let subfolder = 'others';

    if (file_type === 'image') subfolder = 'images';
    else if (file_type === 'document') subfolder = 'documents';
    else if (file_type === 'video') subfolder = 'videos';

    const dir = path.join(process.cwd(), 'uploads', subfolder);
    ensureDir(dir);

    console.log(`[Multer] Uploading "${file.originalname}" (${file.mimetype}) to: ${dir}`);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safeName = path.parse(file.originalname).name.replace(/[^\w.-]+/g, '_');
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}_${safeName}${ext}`;
    console.log(`[Multer] Saved file as: ${filename}`);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const file_type = (req.body.file_type || '').trim().toLowerCase();

  if (!file_type || !allowedMime[file_type]) {
    console.warn(`[Multer] Invalid file_type: ${file_type}`);
    return cb(new Error(`Invalid file_type: ${file_type}`), false);
  }

  console.log(`[Multer] Attempting upload: ${file.originalname} (${file.mimetype})`);

  if (allowedMime[file_type].includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.warn(`[Multer] File type mismatch! Expected: ${file_type}, got: ${file.mimetype}`);
    cb(new Error(`File type mismatch! Selected: ${file_type}, uploaded: ${file.mimetype}`), false);
  }
};

const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB
});

module.exports = uploadMiddleware;
