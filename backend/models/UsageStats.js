const { db } = require('../config/db');

const UsageStats = {
  async log(actionType, recipeId = null, userId = null) {
    const result = await db.execute({
      sql: 'INSERT INTO usage_stats (user_id, action_type, recipe_id) VALUES (?, ?, ?)',
      args: [userId, actionType, recipeId],
    });
    return Number(result.lastInsertRowid);
  },

  async getStats() {
    const result = await db.execute({
      sql: `SELECT action_type, COUNT(*) AS count
            FROM usage_stats
            GROUP BY action_type
            ORDER BY count DESC`,
    });
    return result.rows;
  },

  async getRecipeRanking(limit = 10) {
    const result = await db.execute({
      sql: `SELECT r.id, r.name, r.photo_url, COUNT(*) AS views
            FROM usage_stats us
            JOIN recipes r ON r.id = us.recipe_id
            WHERE us.action_type = 'recipe_viewed'
            GROUP BY r.id, r.name
            ORDER BY views DESC
            LIMIT ?`,
      args: [Number(limit)],
    });
    return result.rows;
  },

  async getDailyStats(days = 30) {
    const result = await db.execute({
      sql: `SELECT date(created_at) AS date, action_type, COUNT(*) AS count
            FROM usage_stats
            WHERE created_at >= date('now', '-' || ? || ' days')
            GROUP BY date(created_at), action_type
            ORDER BY date DESC`,
      args: [String(days)],
    });
    return result.rows;
  },

  async getTotalCounts() {
    const recipes = await db.execute('SELECT COUNT(*) AS total FROM recipes');
    const favorites = await db.execute('SELECT COUNT(*) AS total FROM favorites');
    const planned = await db.execute('SELECT COUNT(*) AS total FROM meal_plan');
    const ingredients = await db.execute('SELECT COUNT(*) AS total FROM ingredients');
    return {
      recipes: recipes.rows[0].total,
      favorites: favorites.rows[0].total,
      plannedMeals: planned.rows[0].total,
      ingredients: ingredients.rows[0].total,
    };
  },
};

module.exports = UsageStats;
