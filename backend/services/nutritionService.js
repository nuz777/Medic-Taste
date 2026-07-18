const { pool } = require('../config/db');

const NUTRITION_CASE = `
  CASE ri.unit
    WHEN 'g' THEN 1
    WHEN 'ml' THEN 1
    WHEN 'unidad' THEN COALESCE(i.grams_per_unit, 0)
    ELSE 0
  END / 100`;

function selectNutrition(prefix = '') {
  return `
    SUM(i.calories_per_100g * ri.amount * ${NUTRITION_CASE}) AS total_calories,
    SUM(i.protein_per_100g * ri.amount * ${NUTRITION_CASE}) AS total_protein,
    SUM(i.carbs_per_100g * ri.amount * ${NUTRITION_CASE}) AS total_carbs,
    SUM(i.fat_per_100g * ri.amount * ${NUTRITION_CASE}) AS total_fat`;
}

const NutritionService = {
  async getRecipeNutrition(recipeId) {
    const [rows] = await pool.query(
      `SELECT ${selectNutrition()}
       FROM recipe_ingredients ri
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE ri.recipe_id = ?`,
      [recipeId]
    );
    return rows[0];
  },

  async getDayNutrition(userId, date) {
    const [rows] = await pool.query(
      `SELECT ${selectNutrition()}
       FROM meal_plan mp
       JOIN recipe_ingredients ri ON ri.recipe_id = mp.recipe_id
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE mp.user_id = ? AND mp.plan_date = ?`,
      [userId, date]
    );
    return rows[0];
  },

  async getWeekNutrition(userId, startDate, endDate) {
    const [rows] = await pool.query(
      `SELECT mp.plan_date,
              ${selectNutrition()}
       FROM meal_plan mp
       JOIN recipe_ingredients ri ON ri.recipe_id = mp.recipe_id
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE mp.user_id = ? AND mp.plan_date BETWEEN ? AND ?
       GROUP BY mp.plan_date
       ORDER BY mp.plan_date`,
      [userId, startDate, endDate]
    );
    return rows;
  },
};

module.exports = NutritionService;
