const { pool } = require('../config/db');

const ALLOWED_FIELDS = ['name', 'onboarding_completed', 'photo_url'];

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT id, name, email, onboarding_completed, photo_url, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ name, email, password }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result.insertId;
  },

  async update(id, fields) {
    const set = [];
    const params = [];
    for (const key of ALLOWED_FIELDS) {
      if (fields[key] !== undefined) {
        set.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }
    if (!set.length) return;
    params.push(id);
    await pool.query(`UPDATE users SET ${set.join(', ')} WHERE id = ?`, params);
  },
};

module.exports = User;
