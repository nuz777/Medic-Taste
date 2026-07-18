USE tasteflow;

-- Missing ingredients referenced by seed_mas_recetas.sql
-- ID 47 = Mango (used in recipes 39, 66, 69)
-- ID 48 = Semillas de chía (used in recipes 35, 39, 67)
-- ID 50 = Edamame (used in recipes 48, 69)
INSERT INTO ingredients (id, name, category, price_per_unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit) VALUES
(47, 'Mango',          'Frutas',    NULL,  60,  0.8, 15.0, 0.4, NULL),
(48, 'Semillas de chia', 'Semillas', NULL, 486, 16.5, 42.1, 30.7, NULL),
(50, 'Edamame',        'Legumbres', NULL, 121, 11.9,  8.9, 5.2, NULL);
