const { db } = require('../config/db');

const Ingredient = {
  async findAll({ category, search } = {}) {
    let sql = 'SELECT * FROM ingredients WHERE 1=1';
    const params = [];
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY category, name';
    const result = await db.execute({ sql, args: params });
    return result.rows;
  },

  async findById(id) {
    const result = await db.execute({ sql: 'SELECT * FROM ingredients WHERE id = ?', args: [id] });
    return result.rows[0];
  },

  async findByName(name) {
    const result = await db.execute({ sql: 'SELECT * FROM ingredients WHERE name = ?', args: [name] });
    return result.rows[0];
  },

  async create({ name, category, price_per_unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g }) {
    const result = await db.execute({
      sql: `INSERT INTO ingredients (name, category, price_per_unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [name, category, price_per_unit || null, calories_per_100g || null, protein_per_100g || null, carbs_per_100g || null, fat_per_100g || null],
    });
    return Number(result.lastInsertRowid);
  },

  async update(id, fields) {
    const allowed = ['name', 'category', 'price_per_unit', 'calories_per_100g', 'protein_per_100g', 'carbs_per_100g', 'fat_per_100g'];
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
    await db.execute({ sql: `UPDATE ingredients SET ${set.join(', ')} WHERE id = ?`, args: params });
  },

  async remove(id) {
    await db.execute({ sql: 'DELETE FROM ingredients WHERE id = ?', args: [id] });
  },
};

module.exports = Ingredient;
