const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect search route
router.use(authMiddleware);

// Search endpoint
// Query params: q (required), type = files/events/all, limit, offset
router.get('/', searchController.search);

module.exports = router;
