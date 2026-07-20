-- -----------------------------------------------------------
-- Usuarios
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  name                  TEXT NOT NULL,
  email                 TEXT NOT NULL UNIQUE,
  password              TEXT NOT NULL,
  onboarding_completed  INTEGER NOT NULL DEFAULT 0,
  photo_url             TEXT DEFAULT NULL,
  created_at            TEXT DEFAULT (datetime('now'))
);

-- -----------------------------------------------------------
-- Recetas
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name             TEXT NOT NULL,
  photo_url        TEXT DEFAULT NULL,
  description      TEXT DEFAULT NULL,
  servings         INTEGER NOT NULL DEFAULT 4,
  prep_time_minutes INTEGER DEFAULT NULL,
  diet_tags        TEXT DEFAULT NULL,
  created_at       TEXT DEFAULT (datetime('now'))
);

-- -----------------------------------------------------------
-- Ingredientes
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingredients (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT NOT NULL,
  category          TEXT DEFAULT NULL,
  price_per_unit    REAL DEFAULT NULL,
  calories_per_100g REAL DEFAULT NULL,
  protein_per_100g  REAL DEFAULT NULL,
  carbs_per_100g    REAL DEFAULT NULL,
  fat_per_100g      REAL DEFAULT NULL,
  grams_per_unit    REAL DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);

-- -----------------------------------------------------------
-- Ingredientes de cada receta (join table)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id      INTEGER NOT NULL,
  ingredient_id  INTEGER NOT NULL,
  amount         REAL NOT NULL,
  unit           TEXT NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_id),
  FOREIGN KEY (recipe_id)     REFERENCES recipes(id)     ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------
-- Pasos de cada receta
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipe_steps (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id     INTEGER NOT NULL,
  step_number   INTEGER NOT NULL,
  instruction   TEXT NOT NULL,
  timer_seconds INTEGER DEFAULT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_steps_recipe ON recipe_steps(recipe_id);

-- -----------------------------------------------------------
-- Planificador semanal
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS meal_plan (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  recipe_id  INTEGER NOT NULL,
  plan_date  TEXT NOT NULL,
  meal_type  TEXT NOT NULL,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_meal_plan_date ON meal_plan(plan_date);

-- -----------------------------------------------------------
-- Favoritos
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL,
  recipe_id  INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE (user_id, recipe_id),
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------
-- Colecciones
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS collections (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name    TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------
-- Recetas dentro de cada colección (join table)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS collection_recipes (
  collection_id INTEGER NOT NULL,
  recipe_id     INTEGER NOT NULL,
  PRIMARY KEY (collection_id, recipe_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id)     REFERENCES recipes(id)     ON DELETE CASCADE
);

-- -----------------------------------------------------------
-- Estadísticas de uso
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS usage_stats (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER DEFAULT NULL,
  action_type TEXT NOT NULL,
  recipe_id   INTEGER DEFAULT NULL,
  created_at  TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE SET NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_stats_action ON usage_stats(action_type);
CREATE INDEX IF NOT EXISTS idx_stats_date ON usage_stats(created_at);

-- -----------------------------------------------------------
-- Precios de tiendas por ingrediente
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS ingredient_store_prices (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  ingredient_id INTEGER NOT NULL,
  store         TEXT NOT NULL,
  price         REAL NOT NULL,
  product_url   TEXT DEFAULT NULL,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);
