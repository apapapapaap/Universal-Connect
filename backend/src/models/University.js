const { pool } = require('../config/database');

exports.findAll = async () => {
  const res = await pool.query('SELECT * FROM universities');
  return res.rows;
};

exports.findById = async (id) => {
  const res = await pool.query('SELECT * FROM universities WHERE id = $1', [id]);
  return res.rows[0];
};
