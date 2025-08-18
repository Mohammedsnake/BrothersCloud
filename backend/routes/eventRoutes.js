const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');

// All routes require authentication
router.use(authMiddleware);

// Create a new event
router.post('/', eventController.createEvent);

// Get all events for logged-in user
router.get('/', eventController.getEvents);

// Update an event by ID
router.put('/:id', eventController.updateEvent);

// Delete an event by ID
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
