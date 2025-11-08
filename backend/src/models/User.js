const { pool } = require('../config/database');

exports.findByEmail = async (email) => {
  const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

exports.findById = async (id) => {
  const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return res.rows[0];
};

exports.create = async (userData) => {
  const { full_name, email, password_hash, username, city, latitude, longitude, university_id } = userData;
  const res = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, username, city, latitude, longitude, university_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [full_name, email, password_hash, username, city, latitude, longitude, university_id]
  );
  return res.rows[0];
};
