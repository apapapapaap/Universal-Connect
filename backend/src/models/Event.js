const { pool } = require('../config/database');

exports.findById = async (id) => {
  const res = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
  return res.rows[0];
};

exports.findAll = async () => {
  const res = await pool.query('SELECT * FROM events');
  return res.rows;
};

exports.create = async (eventData) => {
  const {
    title, description, type, start_at, end_at,
    latitude, longitude, city, organizer_id, max_participants
  } = eventData;
  const res = await pool.query(
    `INSERT INTO events (title, description, type, start_at, end_at, latitude, longitude, city, organizer_id, max_participants)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [title, description, type, start_at, end_at, latitude, longitude, city, organizer_id, max_participants]
  );
  return res.rows[0];
};
