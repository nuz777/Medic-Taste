const { db } = require('../config/db');

const Collection = {
  async findAll(userId) {
    const result = await db.execute({
      sql: 'SELECT * FROM collections WHERE user_id = ? ORDER BY name',
      args: [userId],
    });
    return result.rows;
  },

  async findById(id) {
    const result = await db.execute({ sql: 'SELECT * FROM collections WHERE id = ?', args: [id] });
    return result.rows[0];
  },

  async create(userId, name) {
    const result = await db.execute({
      sql: 'INSERT INTO collections (user_id, name) VALUES (?, ?)',
      args: [userId, name],
    });
    return Number(result.lastInsertRowid);
  },

  async update(id, userId, name) {
    const result = await db.execute({
      sql: 'UPDATE collections SET name = ? WHERE id = ? AND user_id = ?',
      args: [name, id, userId],
    });
    return result.changes > 0;
  },

  async remove(id, userId) {
    const result = await db.execute({
      sql: 'DELETE FROM collections WHERE id = ? AND user_id = ?',
      args: [id, userId],
    });
    return result.changes > 0;
  },

  async getRecipes(collectionId) {
    const result = await db.execute({
      sql: `SELECT r.* FROM recipes r
            JOIN collection_recipes cr ON cr.recipe_id = r.id
            WHERE cr.collection_id = ?
            ORDER BY r.name`,
      args: [collectionId],
    });
    return result.rows;
  },

  async addRecipe(collectionId, recipeId) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO collection_recipes (collection_id, recipe_id) VALUES (?, ?)',
      args: [collectionId, recipeId],
    });
  },

  async removeRecipe(collectionId, recipeId) {
    await db.execute({
      sql: 'DELETE FROM collection_recipes WHERE collection_id = ? AND recipe_id = ?',
      args: [collectionId, recipeId],
    });
  },
};

module.exports = Collection;
