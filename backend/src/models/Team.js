const { pool } = require('../config/database');

exports.findById = async (id) => {
  const res = await pool.query('SELECT * FROM teams WHERE id = $1', [id]);
  return res.rows[0];
};

exports.create = async (teamData) => {
  const { name, description, leader_id } = teamData;
  const res = await pool.query(
    `INSERT INTO teams (name, description, leader_id)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, description, leader_id]
  );
  return res.rows[0];
};
