const { db } = require('../config/db');

const Recipe = {
  async findAll({ search, diet, page = 1, limit = 100 } = {}) {
    let sql = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];
    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    if (diet) {
      const diets = diet.split(',');
      const conditions = diets.map(() => "(',' || diet_tags || ',') LIKE ('%,' || ? || ',%')");
      sql += ` AND (${conditions.join(' OR ')})`;
      params.push(...diets);
    }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(Number(limit), Number(offset));
    const result = await db.execute({ sql, args: params });
    return result.rows;
  },

  async findById(id) {
    const result = await db.execute({ sql: 'SELECT * FROM recipes WHERE id = ?', args: [id] });
    return result.rows[0];
  },

  async create({ name, photo_url, description, servings, prep_time_minutes, diet_tags }) {
    const result = await db.execute({
      sql: `INSERT INTO recipes (name, photo_url, description, servings, prep_time_minutes, diet_tags)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [name, photo_url || null, description || null, servings || 4, prep_time_minutes || null, diet_tags || null],
    });
    return Number(result.lastInsertRowid);
  },

  async update(id, fields) {
    const allowed = ['name', 'photo_url', 'description', 'servings', 'prep_time_minutes', 'diet_tags'];
    const set = [];
    const params = [];
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        set.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }
    if (!set.length) return;
    params.push(id);
    await db.execute({ sql: `UPDATE recipes SET ${set.join(', ')} WHERE id = ?`, args: params });
  },

  async remove(id) {
    await db.execute({ sql: 'DELETE FROM recipes WHERE id = ?', args: [id] });
  },

  async getIngredients(recipeId) {
    const result = await db.execute({
      sql: `SELECT i.*, ri.amount, ri.unit
            FROM recipe_ingredients ri
            JOIN ingredients i ON i.id = ri.ingredient_id
            WHERE ri.recipe_id = ?
            ORDER BY i.category, i.name`,
      args: [recipeId],
    });
    return result.rows;
  },

  async getSteps(recipeId) {
    const result = await db.execute({
      sql: 'SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number',
      args: [recipeId],
    });
    return result.rows;
  },

  async addIngredient(recipeId, ingredientId, amount, unit) {
    await db.execute({
      sql: `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit)
            VALUES (?, ?, ?, ?)
            ON CONFLICT (recipe_id, ingredient_id) DO UPDATE SET amount = excluded.amount, unit = excluded.unit`,
      args: [recipeId, ingredientId, amount, unit],
    });
  },

  async removeIngredient(recipeId, ingredientId) {
    await db.execute({
      sql: 'DELETE FROM recipe_ingredients WHERE recipe_id = ? AND ingredient_id = ?',
      args: [recipeId, ingredientId],
    });
  },

  async addStep(recipeId, stepNumber, instruction, timerSeconds, conn) {
    const q = conn || db;
    await q.execute({
      sql: 'INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES (?, ?, ?, ?)',
      args: [recipeId, stepNumber, instruction, timerSeconds || null],
    });
  },

  async clearSteps(recipeId, conn) {
    const q = conn || db;
    await q.execute({ sql: 'DELETE FROM recipe_steps WHERE recipe_id = ?', args: [recipeId] });
  },

  async getFullRecipe(id) {
    const recipe = await this.findById(id);
    if (!recipe) return null;
    const ingredientsResult = await db.execute({
      sql: `SELECT i.*, ri.amount, ri.unit
            FROM recipe_ingredients ri
            JOIN ingredients i ON i.id = ri.ingredient_id
            WHERE ri.recipe_id = ?`,
      args: [id],
    });
    const stepsResult = await db.execute({
      sql: 'SELECT * FROM recipe_steps WHERE recipe_id = ? ORDER BY step_number',
      args: [id],
    });
    return { ...recipe, ingredients: ingredientsResult.rows, steps: stepsResult.rows };
  },
};

module.exports = Recipe;
