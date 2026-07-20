const { db } = require('../config/db');

const ALLOWED_FIELDS = ['name', 'onboarding_completed', 'photo_url'];

const User = {
  async findByEmail(email) {
    const result = await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] });
    return result.rows[0];
  },

  async findById(id) {
    const result = await db.execute({
      sql: 'SELECT id, name, email, onboarding_completed, photo_url, created_at FROM users WHERE id = ?',
      args: [id],
    });
    return result.rows[0];
  },

  async create({ name, email, password }) {
    const result = await db.execute({
      sql: 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      args: [name, email, password],
    });
    return Number(result.lastInsertRowid);
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
    await db.execute({ sql: `UPDATE users SET ${set.join(', ')} WHERE id = ?`, args: params });
  },
};

module.exports = User;
