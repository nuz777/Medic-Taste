USE tasteflow;

-- =============================================
-- NUEVAS RECETAS (35 adicionales, IDs 35-69)
-- =============================================

INSERT INTO recipes (name, photo_url, description, servings, prep_time_minutes, diet_tags) VALUES
-- DESAYUNOS (35-40)
('Bowl de açaí con granola', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop', 'Bowl cremoso de açaí con granola crujiente, plátano y semillas de chía', 1, 10, 'vegano'),
('Tostada francesa', 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=400&fit=crop', 'Pan integral remojado en huevo y leche, dorado con canela y miel', 2, 15, NULL),
('Omelette de champiñones', 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&h=400&fit=crop', 'Omelette esponjoso relleno de champiñones salteados y queso', 1, 12, NULL),
('Porridge de quinoa con frutas', 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&h=400&fit=crop', 'Quinoa cocida en leche con fresas, arándanos y almendras laminadas', 1, 15, NULL),
('Budín de chía con mango', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop', 'Semillas de chía remojadas en leche con puré de mango y miel', 1, 10, 'vegano'),
('Wrap de huevo y espinaca', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop', 'Tortilla de trigo integral rellena de huevo revuelto y espinaca fresca', 1, 10, NULL),

-- ALMUERZOS (41-50)
('Ensalada de atún con quinoa', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop', 'Ensalada fresca de atún con quinoa, pepino, tomate y limón', 2, 15, NULL),
('Curry de garbanzos con arroz', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop', 'Garbanzos en salsa de curry con leche de coco, servido con arroz blanco', 3, 35, 'vegano'),
('Pechuga rellena de espinaca y queso', 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=400&fit=crop', 'Pechuga de pollo rellena de espinaca y queso parmesano al horno', 2, 30, NULL),
('Salteado de tofu con verduras', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Tofu salteado con brócoli, pimiento y zanahoria en salsa de soja', 2, 20, 'vegano'),
('Hamburguesa de lentejas', 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&h=400&fit=crop', 'Hamburguesa vegetal de lentejas con pan integral, lechuga y tomate', 2, 30, 'vegano'),
('Pollo al horno con batata', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop', 'Pechuga de pollo al horno con batata asada y brócoli', 2, 35, NULL),
('Fideos soba salteados', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop', 'Fideos soba salteados con verduras y salsa de soja', 2, 20, 'vegano'),
('Bowl de salmón con aguacate', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop', 'Salmón marinado con arroz, aguacate y verduras frescas', 2, 25, NULL),
('Wrap de pollo y aguacate', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop', 'Tortilla integral con pollo, aguacate, lechuga y tomate', 1, 15, NULL),
('Estofado de lentejas con batata', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop', 'Lentejas guisadas con batata, zanahoria y especias', 4, 40, 'vegano'),

-- CENAS (51-60)
('Sopa de lentejas y verduras', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop', 'Sopa reconfortante de lentejas con zanahoria, apio y cebolla', 4, 35, 'vegano'),
('Merluza con puré de batata', 'https://images.unsplash.com/photo-1534766555764-ce878a4e947d?w=600&h=400&fit=crop', 'Merluza a la plancha con puré cremoso de batata', 2, 25, NULL),
('Ensalada templada de lentejas', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Lentejas tibias con espinaca, tomate cherry y vinagreta de mostaza', 2, 20, 'vegano'),
('Pasta con brócoli y ajo', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop', 'Pasta salteada con brócoli, ajo y aceite de oliva', 3, 20, 'vegano'),
('Cazuela de garbanzos con espinaca', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop', 'Garbanzos guisados con espinaca, tomate y especias marroquíes', 3, 30, 'vegano'),
('Tortilla de calabacín', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop', 'Tortilla jugosa de calabacín rallado y cebolla', 2, 20, NULL),
('Pollo salteado con brócoli', 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=400&fit=crop', 'Pollo salteado con brócoli, salsa de soja y jengibre', 2, 20, NULL),
('Sopa fría de pepino', 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&h=400&fit=crop', 'Crema fría de pepino, yogur y ajo, perfecta para el verano', 2, 15, NULL),
('Tofu al horno con verduras', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Tofu marinado al horno con pimiento, calabacín y cebolla morada', 2, 30, 'vegano'),
('Ensalada de espinaca y fresas', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop', 'Ensalada fresca de espinaca con fresas, nueces y queso parmesano', 2, 10, NULL),

-- SNACKS / EXTRAS (61-69)
('Bolitas de garbanzo asadas', 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=600&h=400&fit=crop', 'Garbanzos especiados asados al horno, crocantes y saludables', 2, 25, 'vegano'),
('Wrap de hummus y verduras', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop', 'Tortilla integral con hummus, pepino, zanahoria y lechuga', 1, 8, 'vegano'),
('Batido de frutos rojos', 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=400&fit=crop', 'Batido cremoso de fresas, arándanos, yogur y miel', 1, 5, NULL),
('Palitos de zanahoria con hummus', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Palitos de zanahoria fresca con hummus casero', 1, 5, 'vegano'),
('Compota de manzana', 'https://images.unsplash.com/photo-1570488344398-7c7e33c1f51f?w=600&h=400&fit=crop', 'Compota casera de manzana con canela y un toque de miel', 2, 20, 'vegano'),
('Ensalada de frutas tropicales', 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=400&fit=crop', 'Ensalada de mango, plátano, fresas y arándanos con jugo de limón', 2, 8, 'vegano'),
('Barritas de avena y miel', 'https://images.unsplash.com/photo-1490567674984-2aa16c8e1dcc?w=600&h=400&fit=crop', 'Barritas energéticas caseras de avena, almendras y miel', 8, 20, NULL),
('Camarones al ajillo', 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&h=400&fit=crop', 'Camarones salteados con ajo, aceite de oliva y perejil', 2, 10, NULL),
('Ensalada de edamame y quinoa', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop', 'Quinoa con edamame, pepino, mango y aderezo de limón', 2, 20, 'vegano');

-- =============================================
-- RECETA 35: Bowl de açaí con granola
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(35, 19, 1, 'unidad'),
(35, 11, 150, 'ml'),
(35, 42, 30, 'g'),
(35, 48, 10, 'g'),
(35, 23, 10, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(35, 1, 'Congelar el plátano con anticipación', NULL),
(35, 2, 'Licuar el plátano con la leche hasta obtener textura cremosa', 30),
(35, 3, 'Servir en un bol y decorar con granola, semillas de chía y miel', NULL);

-- =============================================
-- RECETA 36: Tostada francesa
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(36, 15, 4, 'rebanada'),
(36, 10, 2, 'unidad'),
(36, 11, 100, 'ml'),
(36, 23, 15, 'ml'),
(36, 45, 50, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(36, 1, 'Batir los huevos con la leche y canela', NULL),
(36, 2, 'Remojar las rebanadas de pan en la mezcla', 30),
(36, 3, 'Cocinar en sartén caliente hasta dorar ambos lados', 240),
(36, 4, 'Servir con fresas y miel por encima', NULL);

-- =============================================
-- RECETA 37: Omelette de champiñones
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(37, 10, 3, 'unidad'),
(37, 31, 100, 'g'),
(37, 9, 30, 'g'),
(37, 6, 10, 'ml'),
(37, 7, 2, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(37, 1, 'Laminar los champiñones y saltear en aceite', 180),
(37, 2, 'Batir los huevos con sal y pimienta', NULL),
(37, 3, 'Verter los huevos sobre los champiñones en la sartén', NULL),
(37, 4, 'Agregar queso rallado y doblar el omelette', 120),
(37, 5, 'Servir caliente', NULL);

-- =============================================
-- RECETA 38: Porridge de quinoa con frutas
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(38, 30, 100, 'g'),
(38, 11, 200, 'ml'),
(38, 45, 50, 'g'),
(38, 44, 50, 'g'),
(38, 22, 15, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(38, 1, 'Enjuagar la quinoa y cocinar en leche', 600),
(38, 2, 'Remover hasta que espese y la quinoa esté tierna', NULL),
(38, 3, 'Servir en un bol y colocar las frutas frescas encima', NULL),
(38, 4, 'Espolvorear almendras laminadas', NULL);

-- =============================================
-- RECETA 39: Budín de chía con mango
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(39, 48, 30, 'g'),
(39, 11, 200, 'ml'),
(39, 47, 100, 'g'),
(39, 23, 10, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(39, 1, 'Mezclar las semillas de chía con la leche y miel', NULL),
(39, 2, 'Refrigerar al menos 4 horas o toda la noche', 14400),
(39, 3, 'Licuar el mango hasta obtener puré', NULL),
(39, 4, 'Servir el budín con puré de mango encima', NULL);

-- =============================================
-- RECETA 40: Wrap de huevo y espinaca
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(40, 10, 2, 'unidad'),
(40, 29, 50, 'g'),
(40, 15, 1, 'rebanada'),
(40, 7, 2, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(40, 1, 'Revolver los huevos y cocinar en sartén antiadherente', 120),
(40, 2, 'Agregar espinaca y cocinar hasta que se marchite', 60),
(40, 3, 'Colocar la mezcla sobre el pan y enrollar', NULL),
(40, 4, 'Cortar por la mitad y servir', NULL);

-- =============================================
-- RECETA 41: Ensalada de atún con quinoa
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(41, 30, 150, 'g'),
(41, 16, 200, 'g'),
(41, 43, 100, 'g'),
(41, 3, 2, 'unidad'),
(41, 6, 15, 'ml'),
(41, 7, 2, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(41, 1, 'Cocinar la quinoa según instrucciones y dejar enfriar', 600),
(41, 2, 'Cortar el pepino y tomate en cubos', NULL),
(41, 3, 'Desmenuzar el atún escurrido', NULL),
(41, 4, 'Mezclar todos los ingredientes y aliñar con aceite y limón', NULL);

-- =============================================
-- RECETA 42: Curry de garbanzos con arroz
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(42, 27, 400, 'g'),
(42, 2, 200, 'g'),
(42, 5, 100, 'g'),
(42, 11, 200, 'ml'),
(42, 6, 20, 'ml'),
(42, 13, 10, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(42, 1, 'Cocinar el arroz en agua con sal', 600),
(42, 2, 'Sofreír cebolla y ajo en aceite', 180),
(42, 3, 'Agregar curry en polvo y mezclar', 30),
(42, 4, 'Añadir garbanzos y leche, cocinar 15 minutos', 900),
(42, 5, 'Servir el curry sobre el arroz', NULL);

-- =============================================
-- RECETA 43: Pechuga rellena de espinaca y queso
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(43, 1, 400, 'g'),
(43, 29, 100, 'g'),
(43, 9, 50, 'g'),
(43, 13, 5, 'g'),
(43, 6, 15, 'ml'),
(43, 7, 3, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(43, 1, 'Hacer un corte en la pechuga para crear un bolsillo', NULL),
(43, 2, 'Saltear espinaca con ajo y mezclar con queso', 120),
(43, 3, 'Rellenar la pechuga y cerrar con palillos', NULL),
(43, 4, 'Sellar en sartén y hornear a 180°C', 900),
(43, 5, 'Dejar reposar 3 minutos y servir', 180);

-- =============================================
-- RECETA 44: Salteado de tofu con verduras
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(44, 28, 300, 'g'),
(44, 41, 100, 'g'),
(44, 24, 1, 'unidad'),
(44, 18, 100, 'g'),
(44, 6, 20, 'ml'),
(44, 13, 10, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(44, 1, 'Cortar el tofu en cubos y presionar para secar', NULL),
(44, 2, 'Cortar todas las verduras en trozos', NULL),
(44, 3, 'Saltear el tofu en aceite hasta dorar', 300),
(44, 4, 'Agregar verduras y saltear 5 minutos', 300),
(44, 5, 'Añadir salsa de soja y servir', NULL);

-- =============================================
-- RECETA 45: Hamburguesa de lentejas
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(45, 17, 300, 'g'),
(45, 5, 50, 'g'),
(45, 18, 50, 'g'),
(45, 12, 50, 'g'),
(45, 15, 2, 'unidad'),
(45, 4, 50, 'g'),
(45, 7, 3, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(45, 1, 'Cocinar lentejas hasta que estén tiernas y escurrir', 1200),
(45, 2, 'Procesar lentejas con cebolla, zanahoria, harina y sal', NULL),
(45, 3, 'Formar medallones y cocinar en sartén', 360),
(45, 4, 'Tostar el pan y armar la hamburguesa con lechuga y tomate', NULL);

-- =============================================
-- RECETA 46: Pollo al horno con batata
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(46, 1, 400, 'g'),
(46, 42, 200, 'g'),
(46, 41, 150, 'g'),
(46, 6, 20, 'ml'),
(46, 13, 10, 'g'),
(46, 7, 3, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(46, 1, 'Sazonar el pollo con ajo, sal y aceite', NULL),
(46, 2, 'Pelar y cortar la batata en bastones', NULL),
(46, 3, 'Colocar todo en bandeja y hornear a 200°C', 1200),
(46, 4, 'Agregar brócoli los últimos 5 minutos', 300),
(46, 5, 'Servir caliente', NULL);

-- =============================================
-- RECETA 47: Fideos soba salteados
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(47, 44, 250, 'g'),
(47, 18, 100, 'g'),
(47, 24, 1, 'unidad'),
(47, 31, 100, 'g'),
(47, 6, 15, 'ml'),
(47, 13, 5, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(47, 1, 'Cocer los fideos soba según instrucciones', 240),
(47, 2, 'Cortar las verduras en juliana', NULL),
(47, 3, 'Saltear las verduras en aceite con ajo', 240),
(47, 4, 'Agregar los fideos escurridos y mezclar', NULL),
(47, 5, 'Servir con salsa de soja', NULL);

-- =============================================
-- RECETA 48: Bowl de salmón con aguacate
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(48, 26, 250, 'g'),
(48, 2, 200, 'g'),
(48, 14, 1, 'unidad'),
(48, 43, 100, 'g'),
(48, 50, 100, 'g'),
(48, 6, 10, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(48, 1, 'Cocinar el arroz y dejar enfriar', 600),
(48, 2, 'Cortar el salmón en cubos y marinar con salsa de soja', 300),
(48, 3, 'Cortar el aguacate y pepino en láminas', NULL),
(48, 4, 'Armar el bowl con arroz, salmón, aguacate y edamame', NULL);

-- =============================================
-- RECETA 49: Wrap de pollo y aguacate
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(49, 1, 200, 'g'),
(49, 14, 1, 'unidad'),
(49, 4, 50, 'g'),
(49, 3, 1, 'unidad'),
(49, 7, 2, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(49, 1, 'Cocinar el pollo a la plancha y cortar en tiras', 360),
(49, 2, 'Machacar el aguacate y untar sobre la tortilla', NULL),
(49, 3, 'Colocar pollo, lechuga y tomate en la tortilla', NULL),
(49, 4, 'Enrollar firmemente y cortar por la mitad', NULL);

-- =============================================
-- RECETA 50: Estofado de lentejas con batata
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(50, 17, 300, 'g'),
(50, 42, 200, 'g'),
(50, 18, 100, 'g'),
(50, 5, 100, 'g'),
(50, 13, 10, 'g'),
(50, 6, 20, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(50, 1, 'Lavar las lentejas y poner a remojo 30 minutos', 1800),
(50, 2, 'Sofreír cebolla y ajo en aceite', 180),
(50, 3, 'Agregar batata y zanahoria en cubos, las lentejas y agua', NULL),
(50, 4, 'Cocinar a fuego medio hasta que todo esté tierno', 1800),
(50, 5, 'Sazonar y servir caliente', NULL);

-- =============================================
-- RECETA 51: Sopa de lentejas y verduras
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(51, 17, 300, 'g'),
(51, 18, 100, 'g'),
(51, 5, 100, 'g'),
(51, 3, 200, 'g'),
(51, 13, 10, 'g'),
(51, 6, 15, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(51, 1, 'Sofreír cebolla y ajo en aceite', 180),
(51, 2, 'Agregar zanahoria picada y tomate triturado', 120),
(51, 3, 'Añadir lentejas y agua caliente, cocinar 25 minutos', 1500),
(51, 4, 'Sazonar y servir caliente', NULL);

-- =============================================
-- RECETA 52: Merluza con puré de batata
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(52, 39, 300, 'g'),
(52, 42, 400, 'g'),
(52, 6, 20, 'ml'),
(52, 7, 3, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(52, 1, 'Pelar la batata, cortar en cubos y hervir hasta blanda', 600),
(52, 2, 'Hacer puré con un tenedor o pisapapas', NULL),
(52, 3, 'Sazonar la merluza con sal y cocinar a la plancha', 360),
(52, 4, 'Servir el puré con la merluza encima', NULL);

-- =============================================
-- RECETA 53: Ensalada templada de lentejas
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(53, 17, 250, 'g'),
(53, 29, 100, 'g'),
(53, 3, 150, 'g'),
(53, 5, 50, 'g'),
(53, 6, 20, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(53, 1, 'Cocinar lentejas hasta tiernas y escurrir', 1200),
(53, 2, 'Saltear espinaca y cebolla en aceite', 120),
(53, 3, 'Mezclar lentejas tibias con espinaca y tomate', NULL),
(53, 4, 'Aliñar con aceite, vinagre y sal', NULL);

-- =============================================
-- RECETA 54: Pasta con brócoli y ajo
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(54, 8, 300, 'g'),
(54, 41, 200, 'g'),
(54, 13, 15, 'g'),
(54, 6, 30, 'ml'),
(54, 7, 3, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(54, 1, 'Cocer la pasta en agua con sal', 480),
(54, 2, 'Cortar el brócoli en floretes y hervir 3 minutos', 180),
(54, 3, 'Saltear ajo laminado en aceite de oliva', 60),
(54, 4, 'Mezclar pasta, brócoli y ajo salteado', NULL),
(54, 5, 'Servir con queso parmesano rallado opcional', NULL);

-- =============================================
-- RECETA 55: Cazuela de garbanzos con espinaca
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(55, 27, 400, 'g'),
(55, 29, 150, 'g'),
(55, 3, 200, 'g'),
(55, 5, 100, 'g'),
(55, 6, 15, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(55, 1, 'Sofreír cebolla en aceite hasta transparente', 180),
(55, 2, 'Agregar tomate triturado y cocinar 5 minutos', 300),
(55, 3, 'Añadir garbanzos y espinaca, cocinar 10 minutos', 600),
(55, 4, 'Sazonar con comino, sal y pimienta', NULL),
(55, 5, 'Servir caliente con pan integral', NULL);

-- =============================================
-- RECETA 56: Tortilla de calabacín
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(56, 10, 4, 'unidad'),
(56, 25, 2, 'unidad'),
(56, 5, 50, 'g'),
(56, 6, 15, 'ml'),
(56, 7, 3, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(56, 1, 'Rallar el calabacín y escurrir el exceso de agua', NULL),
(56, 2, 'Picar la cebolla finamente', NULL),
(56, 3, 'Batir los huevos y mezclar con calabacín y cebolla', NULL),
(56, 4, 'Cocinar en sartén con aceite hasta dorar ambos lados', 300);

-- =============================================
-- RECETA 57: Pollo salteado con brócoli
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(57, 1, 300, 'g'),
(57, 41, 200, 'g'),
(57, 13, 10, 'g'),
(57, 6, 15, 'ml'),
(57, 7, 3, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(57, 1, 'Cortar el pollo en tiras y sazonar', NULL),
(57, 2, 'Cortar el brócoli en floretes pequeños', NULL),
(57, 3, 'Saltear el pollo en aceite hasta dorar', 300),
(57, 4, 'Agregar brócoli y salsa de soja, saltear hasta tierno', 240),
(57, 5, 'Servir con arroz blanco', NULL);

-- =============================================
-- RECETA 58: Sopa fría de pepino
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(58, 43, 2, 'unidad'),
(58, 21, 200, 'g'),
(58, 13, 5, 'g'),
(58, 6, 15, 'ml'),
(58, 7, 3, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(58, 1, 'Pelar los pepinos y cortar en trozos', NULL),
(58, 2, 'Licuar pepino con yogur, ajo y aceite de oliva', 30),
(58, 3, 'Enfriar en nevera al menos 30 minutos', 1800),
(58, 4, 'Servir frío con un chorrito de aceite', NULL);

-- =============================================
-- RECETA 59: Tofu al horno con verduras
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(59, 28, 300, 'g'),
(59, 24, 1, 'unidad'),
(59, 25, 1, 'unidad'),
(59, 40, 100, 'g'),
(59, 6, 20, 'ml'),
(59, 13, 5, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(59, 1, 'Cortar el tofu en cubos y marinar con salsa de soja', 300),
(59, 2, 'Cortar todas las verduras en trozos grandes', NULL),
(59, 3, 'Colocar tofu y verduras en bandeja con aceite y ajo', NULL),
(59, 4, 'Hornear a 200°C por 25 minutos', 1500),
(59, 5, 'Servir caliente', NULL);

-- =============================================
-- RECETA 60: Ensalada de espinaca y fresas
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(60, 29, 150, 'g'),
(60, 45, 100, 'g'),
(60, 32, 30, 'g'),
(60, 9, 30, 'g'),
(60, 6, 20, 'ml'),
(60, 23, 10, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(60, 1, 'Lavar la espinaca y las fresas', NULL),
(60, 2, 'Cortar las fresas en láminas', NULL),
(60, 3, 'Mezclar espinaca, fresas, nueces y parmesano', NULL),
(60, 4, 'Aliñar con aceite y miel', NULL);

-- =============================================
-- RECETA 61: Bolitas de garbanzo asadas
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(61, 27, 400, 'g'),
(61, 6, 15, 'ml'),
(61, 7, 5, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(61, 1, 'Escurrir y secar los garbanzos con papel', NULL),
(61, 2, 'Mezclar con aceite, sal y especias', NULL),
(61, 3, 'Hornear a 200°C hasta que estén crocantes', 1500),
(61, 4, 'Dejar enfriar y servir como snack', NULL);

-- =============================================
-- RECETA 62: Wrap de hummus y verduras
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(62, 27, 150, 'g'),
(62, 43, 100, 'g'),
(62, 18, 100, 'g'),
(62, 4, 50, 'g'),
(62, 6, 15, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(62, 1, 'Preparar hummus procesando garbanzos con aceite, ajo y limón', NULL),
(62, 2, 'Untar hummus sobre la tortilla integral', NULL),
(62, 3, 'Cortar pepino y zanahoria en tiras finas', NULL),
(62, 4, 'Colocar verduras y lechuga sobre el hummus', NULL),
(62, 5, 'Enrollar y cortar por la mitad', NULL);

-- =============================================
-- RECETA 63: Batido de frutos rojos
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(63, 45, 100, 'g'),
(63, 44, 100, 'g'),
(63, 21, 150, 'g'),
(63, 23, 15, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(63, 1, 'Lavar las fresas y arándanos', NULL),
(63, 2, 'Licuar todas las frutas con yogur y miel', 30),
(63, 3, 'Servir frío inmediatamente', NULL);

-- =============================================
-- RECETA 64: Palitos de zanahoria con hummus
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(64, 27, 200, 'g'),
(64, 18, 2, 'unidad'),
(64, 6, 15, 'ml'),
(64, 13, 5, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(64, 1, 'Procesar garbanzos con ajo, aceite y limón para el hummus', NULL),
(64, 2, 'Pelar y cortar las zanahorias en palitos', NULL),
(64, 3, 'Servir el hummus en un bowl con los palitos', NULL);

-- =============================================
-- RECETA 65: Compota de manzana
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(65, 20, 4, 'unidad'),
(65, 23, 20, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(65, 1, 'Pelar y cortar las manzanas en cubos', NULL),
(65, 2, 'Cocinar en una olla con miel y canela a fuego bajo', 600),
(65, 3, 'Triturar ligeramente si se desea textura más fina', NULL),
(65, 4, 'Dejar enfriar y servir tibia o fría', NULL);

-- =============================================
-- RECETA 66: Ensalada de frutas tropicales
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(66, 47, 100, 'g'),
(66, 19, 1, 'unidad'),
(66, 45, 50, 'g'),
(66, 44, 50, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(66, 1, 'Cortar el mango y el plátano en cubos', NULL),
(66, 2, 'Lavar fresas y arándanos', NULL),
(66, 3, 'Mezclar todas las frutas en un bol', NULL),
(66, 4, 'Rociar con jugo de limón y servir', NULL);

-- =============================================
-- RECETA 67: Barritas de avena y miel
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(67, 35, 200, 'g'),
(67, 22, 50, 'g'),
(67, 23, 40, 'ml'),
(67, 48, 30, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(67, 1, 'Mezclar avena, almendras picadas y semillas de chía', NULL),
(67, 2, 'Agregar miel y mezclar bien hasta integrar', NULL),
(67, 3, 'Verter en molde rectangular y presionar firmemente', NULL),
(67, 4, 'Refrigerar 1 hora, cortar en barritas y servir', 3600);

-- =============================================
-- RECETA 68: Camarones al ajillo
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(68, 38, 300, 'g'),
(68, 13, 15, 'g'),
(68, 6, 30, 'ml'),
(68, 7, 3, 'g');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(68, 1, 'Pelar los camarones y sazonar con sal', NULL),
(68, 2, 'Laminar los ajos finamente', NULL),
(68, 3, 'Calentar aceite y dorar los ajos', 60),
(68, 4, 'Saltear los camarones hasta que estén rosados', 180),
(68, 5, 'Servir inmediatamente con perejil picado', NULL);

-- =============================================
-- RECETA 69: Ensalada de edamame y quinoa
-- =============================================
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
(69, 30, 150, 'g'),
(69, 50, 150, 'g'),
(69, 43, 100, 'g'),
(69, 47, 100, 'g'),
(69, 6, 15, 'ml');
INSERT INTO recipe_steps (recipe_id, step_number, instruction, timer_seconds) VALUES
(69, 1, 'Cocinar la quinoa y dejar enfriar', 600),
(69, 2, 'Cocinar el edamame al vapor', 180),
(69, 3, 'Cortar pepino y mango en cubos pequeños', NULL),
(69, 4, 'Mezclar todo y aliñar con aceite y limón', NULL);
