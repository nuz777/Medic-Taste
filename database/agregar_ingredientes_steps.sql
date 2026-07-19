USE medic_taste;

-- Receta 11: Avena con frutas
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(11, 34, 80, 'g'), (11, 11, 200, 'ml'), (11, 45, 50, 'g'), (11, 44, 30, 'g'), (11, 23, 10, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 11;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(11, 1, 'Calentar la leche y añadir la avena', 120),
(11, 2, 'Cocinar a fuego bajo removiendo hasta que espese', 180),
(11, 3, 'Servir en un bol y colocar las frutas frescas encima', NULL),
(11, 4, 'Espolvorear semillas de chía y miel', NULL);

-- Receta 12: Huevos revueltos con espinaca
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(12, 10, 3, 'unidad'), (12, 29, 100, 'g'), (12, 15, 2, 'rebanada'), (12, 7, 2, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 12;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(12, 1, 'Lavar la espinaca y picar finamente', NULL),
(12, 2, 'Batir los huevos con sal', NULL),
(12, 3, 'Calentar aceite en sartén y saltear la espinaca 1 minuto', 60),
(12, 4, 'Agregar los huevos batidos y revolver suavemente hasta cuajar', 120),
(12, 5, 'Servir con pan tostado', NULL);

-- Receta 13: Smoothie bowl de mango
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(13, 46, 150, 'g'), (13, 19, 1, 'unidad'), (13, 11, 100, 'ml'), (13, 34, 30, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 13;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(13, 1, 'Congelar el mango y plátano previamente (mínimo 2 horas)', NULL),
(13, 2, 'Licuar el mango, plátano y leche hasta obtener textura espesa', 30),
(13, 3, 'Verter en un bol y decorar con granola y frutas', NULL);

-- Receta 14: Panqueques de avena
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(14, 34, 120, 'g'), (14, 10, 2, 'unidad'), (14, 11, 120, 'ml'), (14, 23, 15, 'ml'), (14, 44, 30, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 14;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(14, 1, 'Mezclar avena, huevos, leche y miel hasta formar masa', NULL),
(14, 2, 'Calentar sartén con un poco de aceite', 60),
(14, 3, 'Verter porciones de masa y cocinar 2-3 minutos por lado', 180),
(14, 4, 'Servir con frutas frescas y miel', NULL);

-- Receta 15: Tostadas de huevo y aguacate
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(15, 15, 2, 'rebanada'), (15, 10, 2, 'unidad'), (15, 14, 1, 'unidad'), (15, 7, 2, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 15;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(15, 1, 'Tostar el pan integral', 120),
(15, 2, 'Machacar el aguacate con un tenedor', NULL),
(15, 3, 'Freír los huevos al gusto', 180),
(15, 4, 'Untar aguacate en el pan y colocar el huevo encima', NULL),
(15, 5, 'Sazonar con sal y pimienta', NULL);

-- Receta 16: Yogur con granola
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(16, 21, 200, 'g'), (16, 34, 40, 'g'), (16, 44, 30, 'g'), (16, 23, 10, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 16;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(16, 1, 'Colocar el yogur en un bol', NULL),
(16, 2, 'Agregar la granola y las frutas frescas', NULL),
(16, 3, 'Rociar con miel y servir', NULL);

-- Receta 17: Salmón con quinoa
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(17, 26, 300, 'g'), (17, 30, 200, 'g'), (17, 41, 150, 'g'), (17, 6, 30, 'ml'), (17, 13, 10, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 17;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(17, 1, 'Enjuagar la quinoa y cocinar en agua con sal', 900),
(17, 2, 'Sazonar el salmón con ajo, sal y aceite de oliva', NULL),
(17, 3, 'Hornear el salmón a 200°C', 720),
(17, 4, 'Cortar las verduras y asarlas en la misma bandeja', 600),
(17, 5, 'Servir el salmón sobre la quinoa con las verduras', NULL);

-- Receta 18: Bowl de garbanzos
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(18, 27, 400, 'g'), (18, 3, 2, 'unidad'), (18, 43, 100, 'g'), (18, 24, 1, 'unidad'), (18, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 18;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(18, 1, 'Escurrir y enjuagar los garbanzos', NULL),
(18, 2, 'Cortar el tomate, pepino y pimiento en cubos', NULL),
(18, 3, 'Mezclar todos los ingredientes en un bol grande', NULL),
(18, 4, 'Aderezar con aceite de oliva y limón', NULL);

-- Receta 19: Pollo al curry
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(19, 1, 400, 'g'), (19, 2, 300, 'g'), (19, 5, 100, 'g'), (19, 11, 200, 'ml'), (19, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 19;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(19, 1, 'Cortar el pollo en cubos y saltear', 300),
(19, 2, 'Agregar cebolla picada y cocinar hasta dorar', 180),
(19, 3, 'Añadir curry en polvo y mezclar', 30),
(19, 4, 'Verter la leche y cocinar a fuego bajo', 600),
(19, 5, 'Servir sobre arroz blanco', NULL);

-- Receta 20: Pasta integral con verduras
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(20, 8, 300, 'g'), (20, 40, 150, 'g'), (20, 24, 1, 'unidad'), (20, 31, 100, 'g'), (20, 6, 30, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 20;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(20, 1, 'Cocer la pasta integral según instrucciones', 480),
(20, 2, 'Cortar todas las verduras en trozos', NULL),
(20, 3, 'Saltear las verduras en aceite de oliva a fuego fuerte', 300),
(20, 4, 'Mezclar la pasta escurrida con las verduras', NULL),
(20, 5, 'Sazonar con sal y pimienta', NULL);

-- Receta 21: Ensalada templada de quinoa
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(21, 30, 200, 'g'), (21, 29, 100, 'g'), (21, 3, 100, 'g'), (21, 6, 30, 'ml'), (21, 22, 15, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 21;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(21, 1, 'Cocinar la quinoa y dejar enfriar ligeramente', 600),
(21, 2, 'Saltear la espinaca hasta que se marchite', 120),
(21, 3, 'Cortar los tomates por la mitad', NULL),
(21, 4, 'Mezclar todo y aliñar con aceite y limón', NULL);

-- Receta 22: Tacos de pescado
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(22, 37, 400, 'g'), (22, 14, 1, 'unidad'), (22, 24, 1, 'unidad'), (22, 5, 50, 'g'), (22, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 22;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(22, 1, 'Cortar el pescado en tiras y sazonar', NULL),
(22, 2, 'Empanizar y freír hasta dorar', 360),
(22, 3, 'Preparar la salsa machacando aguacate con limón', NULL),
(22, 4, 'Calentar las tortillas y rellenar', 60),
(22, 5, 'Servir con salsa y vegetales frescos', NULL);

-- Receta 23: Bowl teriyaki de pollo
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(23, 1, 300, 'g'), (23, 2, 200, 'g'), (23, 49, 100, 'g'), (23, 40, 100, 'g'), (23, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 23;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(23, 1, 'Cocinar el arroz según instrucciones', 600),
(23, 2, 'Cortar el pollo en tiras y saltear', 300),
(23, 3, 'Añadir salsa teriyaki y cocinar 5 minutos más', 300),
(23, 4, 'Cocinar el edamame al vapor', 180),
(23, 5, 'Armar el bowl con arroz, pollo, edamame y verduras', NULL);

-- Receta 24: Sopa de tomate
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(24, 3, 800, 'g'), (24, 5, 100, 'g'), (24, 13, 10, 'g'), (24, 6, 30, 'ml'), (24, 7, 5, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 24;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(24, 1, 'Sofreír cebolla y ajo en aceite de oliva', 180),
(24, 2, 'Agregar los tomates picados y cocinar 15 minutos', 900),
(24, 3, 'Triturar hasta obtener una crema suave', NULL),
(24, 4, 'Ajustar sazón y servir con albahaca fresca', NULL);

-- Receta 25: Merluza al horno
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(25, 37, 400, 'g'), (25, 41, 150, 'g'), (25, 24, 1, 'unidad'), (25, 6, 20, 'ml'), (25, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 25;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(25, 1, 'Precalentar el horno a 180°C', NULL),
(25, 2, 'Colocar la merluza en papel aluminio', NULL),
(25, 3, 'Agregar rodajas de verduras y aceite', NULL),
(25, 4, 'Hornear hasta que el pescado esté cocido', 900),
(25, 5, 'Servir con una guarnición de verduras', NULL);

-- Receta 26: Revuelto de tofu
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(26, 28, 400, 'g'), (26, 29, 100, 'g'), (26, 24, 1, 'unidad'), (26, 43, 100, 'g'), (26, 6, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 26;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(26, 1, 'Desmenuzar el tofu con un tenedor', NULL),
(26, 2, 'Picar el pimiento y la espinaca', NULL),
(26, 3, 'Saltear el pimiento en aceite', 120),
(26, 4, 'Agregar tofu y cocinar 5 minutos', 300),
(26, 5, 'Añadir espinaca y cocinar hasta que se marchite', 60);

-- Receta 27: Crema de calabacín
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(27, 25, 600, 'g'), (27, 5, 100, 'g'), (27, 13, 10, 'g'), (27, 6, 20, 'ml'), (27, 11, 100, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 27;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(27, 1, 'Picar el calabacín y la cebolla', NULL),
(27, 2, 'Sofreír en aceite con ajo', 180),
(27, 3, 'Agregar agua y cocinar hasta que el calabacín esté tierno', 600),
(27, 4, 'Triturar y añadir un chorrito de leche', NULL),
(27, 5, 'Servir caliente con un chorrito de aceite', NULL);

-- Receta 28: Pechuga a la plancha con ensalada
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(28, 1, 300, 'g'), (28, 4, 150, 'g'), (28, 42, 100, 'g'), (28, 41, 100, 'g'), (28, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 28;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(28, 1, 'Sazonar la pechuga con sal y especias', NULL),
(28, 2, 'Cocinar a la plancha 5-6 minutos por lado', 420),
(28, 3, 'Preparar la ensalada lavando y cortando las verduras', NULL),
(28, 4, 'Hornear la batata en cubos', 1200),
(28, 5, 'Servir el pollo con la ensalada y la batata', NULL);

-- Receta 29: Pasta con marinara
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(29, 8, 300, 'g'), (29, 3, 400, 'g'), (29, 5, 100, 'g'), (29, 13, 10, 'g'), (29, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 29;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(29, 1, 'Picar la cebolla y el ajo finamente', NULL),
(29, 2, 'Sofreír en aceite hasta que estén transparentes', 180),
(29, 3, 'Agregar los tomates picados y cocinar 20 minutos', 1200),
(29, 4, 'Cocer la pasta y escurrir', 480),
(29, 5, 'Mezclar la pasta con la salsa y servir con albahaca', NULL);

-- Receta 30: Bowl de arroz con champiñones
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(30, 2, 200, 'g'), (30, 31, 200, 'g'), (30, 13, 10, 'g'), (30, 6, 20, 'ml'), (30, 43, 50, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 30;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(30, 1, 'Cocinar el arroz según instrucciones', 600),
(30, 2, 'Laminar los champiñones y saltear con ajo', 300),
(30, 3, 'Añadir salsa de soja y cocinar 2 minutos más', 120),
(30, 4, 'Servir el arroz con los champiñones encima', NULL);

-- Receta 31: Hummus con vegetales
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(31, 27, 400, 'g'), (31, 6, 30, 'ml'), (31, 13, 10, 'g'), (31, 18, 100, 'g'), (31, 43, 100, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 31;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(31, 1, 'Escurrir los garbanzos y reservar un poco del líquido', NULL),
(31, 2, 'Triturar garbanzos con ajo, aceite y limón', NULL),
(31, 3, 'Añadir líquido hasta lograr textura cremosa', NULL),
(31, 4, 'Cortar los vegetales en palitos', NULL),
(31, 5, 'Servir el hummus con los vegetales', NULL);

-- Receta 32: Energizantes de avena
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(32, 34, 200, 'g'), (32, 33, 100, 'g'), (32, 47, 80, 'g'), (32, 23, 30, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 32;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(32, 1, 'Mezclar la avena, mantequilla de maní y miel', NULL),
(32, 2, 'Formar bolitas con las manos', NULL),
(32, 3, 'Derretir el chocolate y cubrir las bolitas', NULL),
(32, 4, 'Refrigerar 30 minutos antes de servir', 1800);

-- Receta 33: Edamame con sal
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(33, 49, 300, 'g'), (33, 7, 5, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 33;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(33, 1, 'Hervir agua con sal', 180),
(33, 2, 'Cocinar el edamame 4-5 minutos', 300),
(33, 3, 'Escurrir y espolvorear con sal marina', NULL);

-- Receta 34: Batido verde detox
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(34, 29, 100, 'g'), (34, 46, 100, 'g'), (34, 19, 1, 'unidad'), (34, 11, 200, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 34;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(34, 1, 'Lavar la espinaca y pelar el mango', NULL),
(34, 2, 'Licuar todos los ingredientes hasta obtener un batido homogéneo', 30),
(34, 3, 'Servir frío inmediatamente', NULL);

-- Receta 35: Frutos secos mixtos
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(35, 22, 40, 'g'), (35, 32, 40, 'g'), (35, 47, 30, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 35;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(35, 1, 'Mezclar almendras, nueces y trozos de chocolate negro', NULL),
(35, 2, 'Porcionar y servir', NULL);

-- Receta 36: Tostadas de ricotta
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(36, 15, 2, 'rebanada'), (36, 21, 100, 'g'), (36, 23, 15, 'ml'), (36, 44, 50, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 36;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(36, 1, 'Tostar el pan integral', 120),
(36, 2, 'Untar la ricotta sobre el pan tostado', NULL),
(36, 3, 'Colocar las fresas en rodajas encima', NULL),
(36, 4, 'Rociar con miel y servir', NULL);

-- Receta 37: Wrap de pollo y aguacate II
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(37, 1, 200, 'g'), (37, 14, 1, 'unidad'), (37, 4, 50, 'g'), (37, 3, 1, 'unidad');
DELETE FROM recipe_steps WHERE recipe_id = 37;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(37, 1, 'Cocinar el pollo a la plancha y cortar en tiras', 360),
(37, 2, 'Machacar el aguacate y untar sobre la tortilla', NULL),
(37, 3, 'Colocar pollo, lechuga y tomate en la tortilla', NULL),
(37, 4, 'Enrollar firmemente y cortar por la mitad', NULL);

-- Receta 38: Estofado de lentejas con batata
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(38, 17, 300, 'g'), (38, 41, 200, 'g'), (38, 18, 100, 'g'), (38, 5, 100, 'g'), (38, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 38;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(38, 1, 'Lavar las lentejas', NULL),
(38, 2, 'Sofreír cebolla y ajo en aceite', 180),
(38, 3, 'Agregar batata y zanahoria en cubos, las lentejas y agua', NULL),
(38, 4, 'Cocinar a fuego medio hasta que todo esté tierno', 1800),
(38, 5, 'Sazonar y servir caliente', NULL);

-- Receta 39: Sopa de lentejas y verduras
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(39, 17, 300, 'g'), (39, 18, 100, 'g'), (39, 5, 100, 'g'), (39, 3, 200, 'g'), (39, 6, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 39;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(39, 1, 'Sofreír cebolla y ajo en aceite', 180),
(39, 2, 'Agregar zanahoria picada y tomate triturado', 120),
(39, 3, 'Añadir lentejas y agua caliente, cocinar 25 minutos', 1500),
(39, 4, 'Sazonar y servir caliente', NULL);

-- Receta 40: Merluza con puré de batata
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(40, 37, 300, 'g'), (40, 41, 400, 'g'), (40, 6, 20, 'ml'), (40, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 40;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(40, 1, 'Pelar la batata, cortar en cubos y hervir hasta blanda', 600),
(40, 2, 'Hacer puré con un tenedor o pisapapas', NULL),
(40, 3, 'Sazonar la merluza con sal y cocinar a la plancha', 360),
(40, 4, 'Servir el puré con la merluza encima', NULL);

-- Receta 41: Ensalada templada de lentejas
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(41, 17, 250, 'g'), (41, 29, 100, 'g'), (41, 3, 150, 'g'), (41, 5, 50, 'g'), (41, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 41;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(41, 1, 'Cocinar lentejas hasta tiernas y escurrir', 1200),
(41, 2, 'Saltear espinaca y cebolla en aceite', 120),
(41, 3, 'Mezclar lentejas tibias con espinaca y tomate', NULL),
(41, 4, 'Aliñar con aceite y sal', NULL);

-- Receta 42: Pasta con brócoli y ajo
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(42, 8, 300, 'g'), (42, 40, 200, 'g'), (42, 13, 15, 'g'), (42, 6, 30, 'ml'), (42, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 42;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(42, 1, 'Cocer la pasta en agua con sal', 480),
(42, 2, 'Cortar el brócoli en floretes y hervir 3 minutos', 180),
(42, 3, 'Saltear ajo laminado en aceite de oliva', 60),
(42, 4, 'Mezclar pasta, brócoli y ajo salteado', NULL);

-- Receta 43: Cazuela de garbanzos con espinaca
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(43, 27, 400, 'g'), (43, 29, 150, 'g'), (43, 3, 200, 'g'), (43, 5, 100, 'g'), (43, 6, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 43;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(43, 1, 'Sofreír cebolla en aceite hasta transparente', 180),
(43, 2, 'Agregar tomate triturado y cocinar 5 minutos', 300),
(43, 3, 'Añadir garbanzos y espinaca, cocinar 10 minutos', 600),
(43, 4, 'Sazonar con comino, sal y pimienta', NULL),
(43, 5, 'Servir caliente con pan integral', NULL);

-- Receta 44: Tortilla de calabacín
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(44, 10, 4, 'unidad'), (44, 25, 2, 'unidad'), (44, 5, 50, 'g'), (44, 6, 15, 'ml'), (44, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 44;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(44, 1, 'Rallar el calabacín y escurrir el exceso de agua', NULL),
(44, 2, 'Picar la cebolla finamente', NULL),
(44, 3, 'Batir los huevos y mezclar con calabacín y cebolla', NULL),
(44, 4, 'Cocinar en sartén con aceite hasta dorar ambos lados', 300);

-- Receta 45: Pollo salteado con brócoli
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(45, 1, 300, 'g'), (45, 40, 200, 'g'), (45, 13, 10, 'g'), (45, 6, 15, 'ml'), (45, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 45;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(45, 1, 'Cortar el pollo en tiras y sazonar', NULL),
(45, 2, 'Cortar el brócoli en floretes pequeños', NULL),
(45, 3, 'Saltear el pollo en aceite hasta dorar', 300),
(45, 4, 'Agregar brócoli y salsa de soja, saltear hasta tierno', 240),
(45, 5, 'Servir con arroz blanco', NULL);

-- Receta 46: Sopa fría de pepino
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(46, 43, 2, 'unidad'), (46, 21, 200, 'g'), (46, 13, 5, 'g'), (46, 6, 15, 'ml'), (46, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 46;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(46, 1, 'Pelar los pepinos y cortar en trozos', NULL),
(46, 2, 'Licuar pepino con yogur, ajo y aceite de oliva', 30),
(46, 3, 'Enfriar en nevera al menos 30 minutos', 1800),
(46, 4, 'Servir frío con un chorrito de aceite', NULL);

-- Receta 47: Tofu al horno con verduras
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(47, 28, 300, 'g'), (47, 24, 1, 'unidad'), (47, 25, 1, 'unidad'), (47, 40, 100, 'g'), (47, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 47;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(47, 1, 'Cortar el tofu en cubos y marinar con salsa de soja', 300),
(47, 2, 'Cortar todas las verduras en trozos grandes', NULL),
(47, 3, 'Colocar tofu y verduras en bandeja con aceite y ajo', NULL),
(47, 4, 'Hornear a 200°C por 25 minutos', 1500),
(47, 5, 'Servir caliente', NULL);

-- Receta 48: Ensalada de espinaca y fresas
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(48, 29, 150, 'g'), (48, 44, 100, 'g'), (48, 32, 30, 'g'), (48, 9, 30, 'g'), (48, 6, 20, 'ml'), (48, 23, 10, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 48;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(48, 1, 'Lavar la espinaca y las fresas', NULL),
(48, 2, 'Cortar las fresas en láminas', NULL),
(48, 3, 'Mezclar espinaca, fresas, nueces y parmesano', NULL),
(48, 4, 'Aliñar con aceite y miel', NULL);

-- Receta 49: Bolitas de garbanzo asadas
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(49, 27, 400, 'g'), (49, 6, 15, 'ml'), (49, 7, 5, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 49;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(49, 1, 'Escurrir y secar los garbanzos con papel', NULL),
(49, 2, 'Mezclar con aceite, sal y especias', NULL),
(49, 3, 'Hornear a 200°C hasta que estén crocantes', 1500),
(49, 4, 'Dejar enfriar y servir como snack', NULL);

-- Receta 50: Wrap de hummus y verduras
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(50, 27, 150, 'g'), (50, 43, 100, 'g'), (50, 18, 100, 'g'), (50, 4, 50, 'g'), (50, 6, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 50;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(50, 1, 'Preparar hummus procesando garbanzos con aceite, ajo y limón', NULL),
(50, 2, 'Untar hummus sobre la tortilla integral', NULL),
(50, 3, 'Cortar pepino y zanahoria en tiras finas', NULL),
(50, 4, 'Colocar verduras y lechuga sobre el hummus', NULL),
(50, 5, 'Enrollar y cortar por la mitad', NULL);

-- Receta 51: Batido de frutos rojos
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(51, 44, 100, 'g'), (51, 45, 100, 'g'), (51, 21, 150, 'g'), (51, 23, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 51;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(51, 1, 'Lavar las fresas y arándanos', NULL),
(51, 2, 'Licuar todas las frutas con yogur y miel', 30),
(51, 3, 'Servir frío inmediatamente', NULL);

-- Receta 52: Palitos de zanahoria con hummus
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(52, 27, 200, 'g'), (52, 18, 2, 'unidad'), (52, 6, 15, 'ml'), (52, 13, 5, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 52;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(52, 1, 'Procesar garbanzos con ajo, aceite y limón para el hummus', NULL),
(52, 2, 'Pelar y cortar las zanahorias en palitos', NULL),
(52, 3, 'Servir el hummus en un bowl con los palitos', NULL);

-- Receta 53: Compota de manzana
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(53, 20, 4, 'unidad'), (53, 23, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 53;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(53, 1, 'Pelar y cortar las manzanas en cubos', NULL),
(53, 2, 'Cocinar en una olla con miel y canela a fuego bajo', 600),
(53, 3, 'Triturar ligeramente si se desea textura más fina', NULL),
(53, 4, 'Dejar enfriar y servir', NULL);

-- Receta 54: Ensalada de frutas tropicales
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(54, 46, 100, 'g'), (54, 19, 1, 'unidad'), (54, 44, 50, 'g'), (54, 45, 50, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 54;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(54, 1, 'Cortar el mango y el plátano en cubos', NULL),
(54, 2, 'Lavar fresas y arándanos', NULL),
(54, 3, 'Mezclar todas las frutas en un bol', NULL),
(54, 4, 'Rociar con jugo de limón y servir', NULL);

-- Receta 55: Barritas de avena y miel
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(55, 34, 200, 'g'), (55, 22, 50, 'g'), (55, 23, 40, 'ml'), (55, 48, 30, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 55;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(55, 1, 'Mezclar avena, almendras picadas y semillas de chía', NULL),
(55, 2, 'Agregar miel y mezclar bien hasta integrar', NULL),
(55, 3, 'Verter en molde rectangular y presionar firmemente', NULL),
(55, 4, 'Refrigerar 1 hora, cortar en barritas y servir', 3600);

-- Receta 56: Camarones al ajillo
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(56, 38, 300, 'g'), (56, 13, 15, 'g'), (56, 6, 30, 'ml'), (56, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 56;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(56, 1, 'Pelar los camarones y sazonar con sal', NULL),
(56, 2, 'Laminar los ajos finamente', NULL),
(56, 3, 'Calentar aceite y dorar los ajos', 60),
(56, 4, 'Saltear los camarones hasta que estén rosados', 180),
(56, 5, 'Servir inmediatamente', NULL);

-- Receta 57: Ensalada de edamame y quinoa
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(57, 30, 150, 'g'), (57, 49, 150, 'g'), (57, 43, 100, 'g'), (57, 46, 100, 'g'), (57, 6, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 57;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(57, 1, 'Cocinar la quinoa y dejar enfriar', 600),
(57, 2, 'Cocinar el edamame al vapor', 180),
(57, 3, 'Cortar pepino y mango en cubos pequeños', NULL),
(57, 4, 'Mezclar todo y aliñar con aceite y limón', NULL);

-- Receta 58: Bowl de pollo y quinoa
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(58, 1, 250, 'g'), (58, 30, 150, 'g'), (58, 14, 1, 'unidad'), (58, 3, 1, 'unidad'), (58, 6, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 58;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(58, 1, 'Cocinar la quinoa y dejar enfriar', 600),
(58, 2, 'Cocinar el pollo a la plancha y cortar en tiras', 360),
(58, 3, 'Cortar aguacate y tomate en cubos', NULL),
(58, 4, 'Armar el bowl con quinoa, pollo, aguacate y tomate', NULL),
(58, 5, 'Aliñar con aceite de oliva', NULL);

-- Receta 59: Salmón al horno con espárragos
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(59, 26, 300, 'g'), (59, 30, 200, 'g'), (59, 24, 1, 'unidad'), (59, 6, 20, 'ml'), (59, 13, 10, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 59;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(59, 1, 'Sazonar el salmón con ajo, sal y aceite', NULL),
(59, 2, 'Cocinar la quinoa', 600),
(59, 3, 'Cortar las verduras y colocar en bandeja con el salmón', NULL),
(59, 4, 'Hornear todo a 200°C', 720),
(59, 5, 'Servir el salmón sobre quinoa con verduras', NULL);

-- Receta 60: Pasta carbonara saludable
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(60, 8, 300, 'g'), (60, 10, 2, 'unidad'), (60, 9, 40, 'g'), (60, 21, 50, 'g'), (60, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 60;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(60, 1, 'Cocer la pasta en agua con sal', 480),
(60, 2, 'Batir huevos con yogur y queso rallado', NULL),
(60, 3, 'Mezclar la pasta caliente con la mezcla de huevo', NULL),
(60, 4, 'Servir inmediatamente con queso extra', NULL);

-- Receta 61: Ensalada de pollo y mango
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(61, 1, 200, 'g'), (61, 46, 100, 'g'), (61, 29, 100, 'g'), (61, 6, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 61;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(61, 1, 'Cocinar el pollo a la plancha y cortar en tiras', 360),
(61, 2, 'Cortar el mango en cubos', NULL),
(61, 3, 'Mezclar espinaca, pollo y mango', NULL),
(61, 4, 'Aliñar con aceite de oliva y limón', NULL);

-- Receta 62: Wok de verduras con tofu
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(62, 28, 300, 'g'), (62, 40, 150, 'g'), (62, 24, 1, 'unidad'), (62, 18, 100, 'g'), (62, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 62;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(62, 1, 'Cortar el tofu en cubos y saltear hasta dorar', 300),
(62, 2, 'Cortar brócoli, pimiento y zanahoria', NULL),
(62, 3, 'Saltear las verduras en el wok', 240),
(62, 4, 'Agregar tofu y salsa de soja, mezclar bien', NULL),
(62, 5, 'Servir caliente', NULL);

-- Receta 63: Arroz con pollo y verduras
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(63, 1, 300, 'g'), (63, 2, 250, 'g'), (63, 24, 1, 'unidad'), (63, 18, 100, 'g'), (63, 5, 50, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 63;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(63, 1, 'Cortar el pollo en cubos y saltear', 300),
(63, 2, 'Agregar cebolla, pimiento y zanahoria picados', 180),
(63, 3, 'Añadir arroz y agua caliente, cocinar tapado', 600),
(63, 4, 'Dejar reposar y servir', 300);

-- Receta 64: Crema de zanahoria y jengibre
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(64, 18, 500, 'g'), (64, 5, 100, 'g'), (64, 11, 100, 'ml'), (64, 6, 15, 'ml'), (64, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 64;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(64, 1, 'Pelar y picar zanahorias y cebolla', NULL),
(64, 2, 'Sofreír en aceite', 180),
(64, 3, 'Agregar agua y jengibre rallado, cocinar 20 minutos', 1200),
(64, 4, 'Triturar, agregar leche y sazonar', NULL),
(64, 5, 'Servir caliente', NULL);

-- Receta 65: Pollo al horno con romero
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(65, 1, 400, 'g'), (65, 41, 200, 'g'), (65, 13, 10, 'g'), (65, 6, 20, 'ml'), (65, 7, 3, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 65;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(65, 1, 'Sazonar el pollo con ajo, romero, sal y aceite', NULL),
(65, 2, 'Pelar y cortar la batata en rodajas', NULL),
(65, 3, 'Colocar todo en bandeja y hornear a 200°C', 1200),
(65, 4, 'Servir caliente', NULL);

-- Receta 66: Ensalada de quinoa y garbanzos
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(66, 30, 150, 'g'), (66, 27, 200, 'g'), (66, 43, 100, 'g'), (66, 3, 1, 'unidad'), (66, 6, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 66;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(66, 1, 'Cocinar la quinoa', 600),
(66, 2, 'Cortar pepino y tomate en cubos', NULL),
(66, 3, 'Mezclar quinoa, garbanzos y verduras', NULL),
(66, 4, 'Aliñar con aceite y limón', NULL);

-- Receta 67: Tortilla de espinaca y queso
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(67, 10, 3, 'unidad'), (67, 29, 100, 'g'), (67, 9, 30, 'g'), (67, 6, 10, 'ml'), (67, 7, 2, 'g');
DELETE FROM recipe_steps WHERE recipe_id = 67;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(67, 1, 'Saltear la espinaca en aceite', 60),
(67, 2, 'Batir los huevos con sal', NULL),
(67, 3, 'Verter los huevos sobre la espinaca', NULL),
(67, 4, 'Agregar queso rallado y cocinar hasta dorar', 180);

-- Receta 68: Batido de avena y manzana
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(68, 34, 40, 'g'), (68, 20, 1, 'unidad'), (68, 11, 200, 'ml'), (68, 23, 10, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 68;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(68, 1, 'Pelar y cortar la manzana', NULL),
(68, 2, 'Licuar avena, manzana, leche, miel y canela', 30),
(68, 3, 'Servir frío', NULL);

-- Receta 69: Hummus de remolacha
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(69, 27, 300, 'g'), (69, 18, 100, 'g'), (69, 13, 5, 'g'), (69, 6, 20, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 69;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(69, 1, 'Cocinar la remolacha hasta tierna y pelar', 1200),
(69, 2, 'Procesar garbanzos, remolacha, ajo y aceite', NULL),
(69, 3, 'Servir con palitos de zanahoria', NULL);

-- Receta 70: Pollo agridulce
INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(70, 1, 400, 'g'), (70, 2, 200, 'g'), (70, 24, 1, 'unidad'), (70, 5, 50, 'g'), (70, 6, 15, 'ml');
DELETE FROM recipe_steps WHERE recipe_id = 70;
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(70, 1, 'Cortar pollo en cubos y saltear', 300),
(70, 2, 'Cortar pimiento y cebolla en trozos', NULL),
(70, 3, 'Agregar verduras al pollo y saltear', 180),
(70, 4, 'Añadir salsa agridulce y cocinar 5 minutos', 300),
(70, 5, 'Servir con arroz blanco', NULL);

SELECT CONCAT('Ingredientes agregados correctamente') AS resultado;
