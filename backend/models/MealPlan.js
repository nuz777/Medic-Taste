const { db } = require('../config/db');

const MealPlan = {
  async findByDateRange(userId, startDate, endDate) {
    const result = await db.execute({
      sql: `SELECT mp.*, r.name AS recipe_name, r.photo_url, r.prep_time_minutes
            FROM meal_plan mp
            JOIN recipes r ON r.id = mp.recipe_id
            WHERE mp.user_id = ? AND mp.plan_date BETWEEN ? AND ?
            ORDER BY mp.plan_date, mp.meal_type`,
      args: [userId, startDate, endDate],
    });
    return result.rows;
  },

  async findByDate(userId, date) {
    const result = await db.execute({
      sql: `SELECT mp.*, r.name AS recipe_name, r.photo_url, r.prep_time_minutes
            FROM meal_plan mp
            JOIN recipes r ON r.id = mp.recipe_id
            WHERE mp.user_id = ? AND mp.plan_date = ?
            ORDER BY mp.meal_type`,
      args: [userId, date],
    });
    return result.rows;
  },

  async add(userId, recipeId, planDate, mealType) {
    const result = await db.execute({
      sql: 'INSERT INTO meal_plan (user_id, recipe_id, plan_date, meal_type) VALUES (?, ?, ?, ?)',
      args: [userId, recipeId, planDate, mealType],
    });
    return Number(result.lastInsertRowid);
  },

  async remove(id, userId) {
    const result = await db.execute({
      sql: 'DELETE FROM meal_plan WHERE id = ? AND user_id = ?',
      args: [id, userId],
    });
    return result.changes > 0;
  },

  async update(id, userId, { plan_date, meal_type }) {
    const set = [];
    const params = [];
    if (plan_date) { set.push('plan_date = ?'); params.push(plan_date); }
    if (meal_type) { set.push('meal_type = ?'); params.push(meal_type); }
    if (!set.length) return true;
    params.push(id, userId);
    const result = await db.execute({
      sql: `UPDATE meal_plan SET ${set.join(', ')} WHERE id = ? AND user_id = ?`,
      args: params,
    });
    return result.changes > 0;
  },

  async getWeeklySummary(userId, startDate, endDate) {
    const result = await db.execute({
      sql: `SELECT mp.plan_date, mp.meal_type, r.name AS recipe_name, r.servings, r.prep_time_minutes
            FROM meal_plan mp
            JOIN recipes r ON r.id = mp.recipe_id
            WHERE mp.user_id = ? AND mp.plan_date BETWEEN ? AND ?
            ORDER BY mp.plan_date, mp.meal_type`,
      args: [userId, startDate, endDate],
    });
    return result.rows;
  },

  async clearWeek(userId, startDate, endDate) {
    await db.execute({
      sql: 'DELETE FROM meal_plan WHERE user_id = ? AND plan_date BETWEEN ? AND ?',
      args: [userId, startDate, endDate],
    });
  },
};

module.exports = MealPlan;
