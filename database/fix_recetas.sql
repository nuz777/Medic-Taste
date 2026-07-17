USE tasteflow;

-- Insertar ingredientes faltantes (IDs 26-50)
INSERT IGNORE INTO ingredients (id, name, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, grams_per_unit) VALUES
(26, 'Salmón', 'Pescados', 208, 20.0, 0.0, 13.0, NULL),
(27, 'Garbanzos', 'Legumbres', 164, 8.9, 27.0, 2.6, NULL),
(28, 'Tofu', 'Legumbres', 76, 8.0, 1.9, 4.8, NULL),
(29, 'Espinaca', 'Verduras', 23, 2.9, 3.6, 0.4, NULL),
(30, 'Quinoa', 'Granos', 120, 4.4, 21.3, 1.9, NULL),
(31, 'Champiñones', 'Verduras', 22, 3.1, 3.3, 0.3, NULL),
(32, 'Nueces', 'Frutos Secos', 654, 15.2, 13.7, 65.2, NULL),
(33, 'Mantequilla de maní', 'Frutos Secos', 588, 25.1, 20.0, 50.4, NULL),
(34, 'Avena', 'Granos', 389, 16.9, 66.3, 6.9, NULL),
(35, 'Sémola de trigo', 'Granos', 360, 12.7, 72.8, 1.1, NULL),
(36, 'Atún fresco', 'Pescados', 132, 29.0, 0.0, 1.0, NULL),
(37, 'Merluza', 'Pescados', 86, 16.0, 0.0, 2.3, NULL),
(38, 'Camarones', 'Pescados', 99, 24.0, 0.2, 0.3, NULL),
(39, 'Cebolla morada', 'Verduras', 40, 1.1, 9.3, 0.1, NULL),
(40, 'Brócoli', 'Verduras', 34, 2.8, 7.0, 0.4, NULL),
(41, 'Batata', 'Verduras', 86, 1.6, 20.0, 0.1, NULL),
(42, 'Pimiento verde', 'Verduras', 20, 0.9, 4.6, 0.2, NULL),
(43, 'Pepino', 'Verduras', 15, 0.7, 3.6, 0.1, NULL),
(44, 'Fresas', 'Frutas', 32, 0.7, 7.7, 0.3, NULL),
(45, 'Arándanos', 'Frutas', 57, 0.7, 14.5, 0.3, NULL),
(46, 'Mango', 'Frutas', 60, 0.8, 15.0, 0.4, NULL),
(47, 'Chocolate negro', 'Snacks', 546, 5.0, 60.0, 31.0, NULL),
(48, 'Semillas de chía', 'Frutos Secos', 486, 16.5, 42.1, 30.7, NULL),
(49, 'Edamame', 'Legumbres', 121, 11.9, 8.9, 5.2, NULL),
(50, 'Soba (fideos)', 'Granos', 133, 5.8, 27.0, 0.7, NULL);

-- Verificar que haya 50 ingredientes
SELECT CONCAT('Total ingredientes: ', COUNT(*)) AS resultado FROM ingredients;
