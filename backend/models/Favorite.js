const { db } = require('../config/db');

const Favorite = {
  async findAll(userId) {
    const result = await db.execute({
      sql: `SELECT f.*, r.name, r.photo_url, r.description, r.diet_tags
            FROM favorites f
            JOIN recipes r ON r.id = f.recipe_id
            WHERE f.user_id = ?
            ORDER BY f.id DESC`,
      args: [userId],
    });
    return result.rows;
  },

  async findById(userId, recipeId) {
    const result = await db.execute({
      sql: 'SELECT * FROM favorites WHERE user_id = ? AND recipe_id = ?',
      args: [userId, recipeId],
    });
    return result.rows[0];
  },

  async add(userId, recipeId) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO favorites (user_id, recipe_id) VALUES (?, ?)',
      args: [userId, recipeId],
    });
  },

  async remove(userId, recipeId) {
    await db.execute({
      sql: 'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?',
      args: [userId, recipeId],
    });
  },
};

module.exports = Favorite;
