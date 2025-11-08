const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const eventsRoutes = require('./events.routes');
const usersRoutes = require('./users.routes');
const aiRoutes = require('./ai.routes');

router.use('/auth', authRoutes);
router.use('/events', eventsRoutes);
router.use('/users', usersRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
