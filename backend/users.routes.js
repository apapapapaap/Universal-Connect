const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { pool } = require('../config/database');

// Get nearby users
router.get('/nearby', authMiddleware, async (req, res) => {
  try {
    const { lat, lng, radius = 50 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude required' });
    }

    const result = await pool.query(`
      SELECT 
        u.id, u.full_name, u.username, u.city,
        (6371 * acos(
          cos(radians($1)) * cos(radians(u.latitude)) * 
          cos(radians(u.longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(u.latitude))
        )) AS distance
      FROM users u
      WHERE u.id != $3
        AND (6371 * acos(
          cos(radians($1)) * cos(radians(u.latitude)) * 
          cos(radians(u.longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(u.latitude))
        )) <= $4
      ORDER BY distance ASC
    `, [parseFloat(lat), parseFloat(lng), req.user.userId, parseFloat(radius)]);

    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch nearby users', error: error.message });
  }
});

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, username, email, city, university_id FROM users WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
});

module.exports = router;
