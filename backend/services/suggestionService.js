const { db } = require('../config/db');

const SuggestionService = {
  async suggestByIngredients(ingredientNames, limit = 5) {
    if (!ingredientNames.length) return [];
    const placeholders = ingredientNames.map(() => '?').join(',');
    const result = await db.execute({
      sql: `SELECT r.id, r.name, r.photo_url, r.description, r.prep_time_minutes, r.diet_tags,
                   COUNT(DISTINCT ri.ingredient_id) AS matching_ingredients,
                   (SELECT COUNT(*) FROM recipe_ingredients WHERE recipe_id = r.id) AS total_ingredients
            FROM recipes r
            JOIN recipe_ingredients ri ON ri.recipe_id = r.id
            JOIN ingredients i ON i.id = ri.ingredient_id
            WHERE i.name IN (${placeholders})
            GROUP BY r.id
            ORDER BY matching_ingredients DESC, total_ingredients ASC
            LIMIT ?`,
      args: [...ingredientNames, String(limit)],
    });
    return result.rows;
  },

  async suggestByDiet(diet, limit = 10) {
    const result = await db.execute({
      sql: `SELECT * FROM recipes
            WHERE (',' || diet_tags || ',') LIKE ('%,' || ? || ',%')
            ORDER BY created_at DESC LIMIT ?`,
      args: [diet, String(limit)],
    });
    return result.rows;
  },

  async suggestQuickMeals(maxMinutes = 20, limit = 10) {
    const result = await db.execute({
      sql: 'SELECT * FROM recipes WHERE prep_time_minutes <= ? ORDER BY prep_time_minutes ASC LIMIT ?',
      args: [maxMinutes, String(limit)],
    });
    return result.rows;
  },
};

module.exports = SuggestionService;
