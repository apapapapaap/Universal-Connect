const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events.controller');
const authMiddleware = require('../middleware/auth');

router.get('/', eventsController.getEvents);
router.get('/:id', eventsController.getEventById);
router.post('/', authMiddleware, eventsController.createEvent);

module.exports = router;
