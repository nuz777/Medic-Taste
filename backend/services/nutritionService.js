const { db } = require('../config/db');

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
    const result = await db.execute({
      sql: `SELECT ${selectNutrition()}
            FROM recipe_ingredients ri
            JOIN ingredients i ON i.id = ri.ingredient_id
            WHERE ri.recipe_id = ?`,
      args: [recipeId],
    });
    return result.rows[0];
  },

  async getDayNutrition(userId, date) {
    const result = await db.execute({
      sql: `SELECT ${selectNutrition()}
            FROM meal_plan mp
            JOIN recipe_ingredients ri ON ri.recipe_id = mp.recipe_id
            JOIN ingredients i ON i.id = ri.ingredient_id
            WHERE mp.user_id = ? AND mp.plan_date = ?`,
      args: [userId, date],
    });
    return result.rows[0];
  },

  async getWeekNutrition(userId, startDate, endDate) {
    const result = await db.execute({
      sql: `SELECT mp.plan_date,
                   ${selectNutrition()}
            FROM meal_plan mp
            JOIN recipe_ingredients ri ON ri.recipe_id = mp.recipe_id
            JOIN ingredients i ON i.id = ri.ingredient_id
            WHERE mp.user_id = ? AND mp.plan_date BETWEEN ? AND ?
            GROUP BY mp.plan_date
            ORDER BY mp.plan_date`,
      args: [userId, startDate, endDate],
    });
    return result.rows;
  },
};

module.exports = NutritionService;
