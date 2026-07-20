const { db } = require('../config/db');

exports.getAll = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    let where = [];
    let params = [];

    if (search && search.trim()) {
      where.push('name LIKE ?');
      params.push(`%${search.trim()}%`);
    }
    if (category && category.trim()) {
      where.push('category = ?');
      params.push(category.trim());
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const totalResult = await db.execute({
      sql: `SELECT COUNT(*) AS total FROM ingredients ${whereClause}`,
      args: params,
    });
    const total = totalResult.rows[0].total;

    const rowsResult = await db.execute({
      sql: `SELECT id, name, category, price_per_unit, calories_per_100g,
                   protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit
            FROM ingredients ${whereClause}
            ORDER BY category, name
            LIMIT ? OFFSET ?`,
      args: [...params, limitNum, offset],
    });

    res.json({
      ingredients: rowsResult.rows,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) { next(err); }
};

exports.getCategories = async (_req, res, next) => {
  try {
    const result = await db.execute(
      'SELECT DISTINCT category FROM ingredients WHERE category IS NOT NULL ORDER BY category'
    );
    res.json(result.rows.map(r => r.category));
  } catch (err) { next(err); }
};
