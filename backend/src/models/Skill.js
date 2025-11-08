const { pool } = require('../config/database');

exports.findAll = async () => {
  const res = await pool.query('SELECT * FROM skills');
  return res.rows;
};

exports.create = async (name) => {
  const res = await pool.query('INSERT INTO skills (name) VALUES ($1) RETURNING *', [name]);
  return res.rows[0];
};
