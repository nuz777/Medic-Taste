USE tasteflow;

-- Eliminar datos existentes (orden inverso por FK)
DELETE FROM recipe_steps WHERE recipe_id > 10;
DELETE FROM recipe_ingredients WHERE recipe_id > 10;
DELETE FROM meal_plan WHERE recipe_id > 10;
DELETE FROM favorites WHERE recipe_id > 10;
DELETE FROM collection_recipes WHERE recipe_id > 10;
DELETE FROM recipes WHERE id > 10;

-- Resetear auto_increment
ALTER TABLE recipes AUTO_INCREMENT = 11;

-- =============================================
-- RECETAS ORIGINALES que faltaban (desde seed.sql)
-- =============================================

INSERT INTO recipes (id, name, photo_url, description, servings, prep_time_minutes, diet_tags) VALUES
(11, 'Avena con frutas', 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&h=400&fit=crop', 'Avena cremosa con fresas, arándanos y semillas de chía', 1, 10, 'vegano'),
(12, 'Huevos revueltos con espinaca', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop', 'Huevos suaves con espinaca fresca y pan tostado', 2, 12, NULL),
(13, 'Smoothie bowl de mango', 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop', 'Bowl energizante de mango, plátano y granola', 1, 8, 'vegano'),
(14, 'Panqueques de avena', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop', 'Panqueques saludables de avena con miel y frutas', 2, 15, NULL),
(15, 'Tostadas de huevo y aguacate', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop', 'Pan integral con huevo pochado y aguacate', 1, 12, NULL),
(16, 'Yogur con granola', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop', 'Yogur griego con granola casera y frutas frescas', 1, 5, NULL),
(17, 'Salmón con quinoa', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop', 'Salmón al horno con quinoa y verduras asadas', 2, 30, NULL),
(18, 'Bowl de garbanzos', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Bowl mediterráneo con garbanzos, verduras y tahini', 2, 20, 'vegano'),
(19, 'Pollo al curry', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop', 'Pollo tierno en salsa de curry con arroz basmati', 4, 40, NULL),
(20, 'Pasta integral con verduras', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop', 'Pasta integral salteada con brócoli, pimiento y champiñones', 3, 25, 'vegano'),
(21, 'Ensalada templada de quinoa', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop', 'Quinoa con espinaca, tomate cherry y aderezo de limón', 2, 20, 'vegano'),
(22, 'Tacos de pescado', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=400&fit=crop', 'Tacos de pescado empanizado con salsa de aguacate', 3, 25, NULL),
(23, 'Bowl teriyaki de pollo', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop', 'Arroz con pollo teriyaki, edamame y verduras', 2, 30, NULL),
(24, 'Sopa de tomate', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop', 'Sopa cremosa de tomate al horno con albahaca', 3, 35, 'vegano'),
(25, 'Merluza al horno', 'https://images.unsplash.com/photo-1534766555764-ce878a4e947d?w=600&h=400&fit=crop', 'Merluza con limón, hierbas y verduras', 2, 25, NULL),
(26, 'Revuelto de tofu', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Tofu revueltado con verduras y especias', 2, 15, 'vegano'),
(27, 'Crema de calabacín', 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&h=400&fit=crop', 'Crema ligera de calabacín con jengibre', 3, 30, 'vegano'),
(28, 'Pechuga de pollo a la plancha', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop', 'Pollo jugoso con ensalada verde y batata asada', 2, 20, NULL),
(29, 'Pasta con marinara', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop', 'Pasta con salsa de tomate casera y albahaca fresca', 3, 30, 'vegano'),
(30, 'Bowl de arroz con champiñones', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Arroz salteado con champiñones, ajo y salsa de soja', 2, 20, 'vegano'),
(31, 'Hummus con vegetales', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Hummus cremoso con palitos de zanahoria y pepino', 2, 10, 'vegano'),
(32, 'Energizantes de avena', 'https://images.unsplash.com/photo-1490567674984-2aa16c8e1dcc?w=600&h=400&fit=crop', 'Bolitas de avena, mantequilla de maní y chocolate', 10, 15, NULL),
(33, 'Edamame con sal', 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=600&h=400&fit=crop', 'Edamame al vapor con una pizca de sal marina', 2, 5, 'vegano'),
(34, 'Batido verde detox', 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=600&h=400&fit=crop', 'Batido de espinaca, mango y jengibre fresco', 1, 5, 'vegano'),
(35, 'Frutos secos mixtos', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=400&fit=crop', 'Mix de almendras, nueces y chocolate negro', 1, 2, NULL),
(36, 'Tostadas de ricotta', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop', 'Pan tostado con ricotta, miel y frutas frescas', 1, 8, NULL);

-- =============================================
-- RECETAS NUEVAS (37-70)
-- =============================================

INSERT INTO recipes (name, photo_url, description, servings, prep_time_minutes, diet_tags) VALUES
('Wrap de pollo y aguacate II', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop', 'Tortilla integral con pollo, aguacate, lechuga y tomate', 1, 15, NULL),
('Estofado de lentejas con batata', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop', 'Lentejas guisadas con batata, zanahoria y especias', 4, 40, 'vegano'),
('Sopa de lentejas y verduras', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop', 'Sopa reconfortante de lentejas con zanahoria y cebolla', 4, 35, 'vegano'),
('Merluza con puré de batata', 'https://images.unsplash.com/photo-1534766555764-ce878a4e947d?w=600&h=400&fit=crop', 'Merluza a la plancha con puré cremoso de batata', 2, 25, NULL),
('Ensalada templada de lentejas', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Lentejas tibias con espinaca, tomate y vinagreta', 2, 20, 'vegano'),
('Pasta con brócoli y ajo', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop', 'Pasta salteada con brócoli, ajo y aceite de oliva', 3, 20, 'vegano'),
('Cazuela de garbanzos con espinaca', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop', 'Garbanzos guisados con espinaca, tomate y especias', 3, 30, 'vegano'),
('Tortilla de calabacín', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop', 'Tortilla jugosa de calabacín rallado y cebolla', 2, 20, NULL),
('Pollo salteado con brócoli', 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=400&fit=crop', 'Pollo salteado con brócoli, salsa de soja y jengibre', 2, 20, NULL),
('Sopa fría de pepino', 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&h=400&fit=crop', 'Crema fría de pepino, yogur y ajo, perfecta para el verano', 2, 15, NULL),
('Tofu al horno con verduras', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Tofu marinado al horno con pimiento, calabacín y cebolla', 2, 30, 'vegano'),
('Ensalada de espinaca y fresas', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop', 'Ensalada fresca de espinaca con fresas, nueces y parmesano', 2, 10, NULL),
('Bolitas de garbanzo asadas', 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=600&h=400&fit=crop', 'Garbanzos especiados asados al horno, crocantes', 2, 25, 'vegano'),
('Wrap de hummus y verduras', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop', 'Tortilla integral con hummus, pepino, zanahoria y lechuga', 1, 8, 'vegano'),
('Batido de frutos rojos', 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=400&fit=crop', 'Batido cremoso de fresas, arándanos, yogur y miel', 1, 5, NULL),
('Palitos de zanahoria con hummus', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Palitos de zanahoria fresca con hummus casero', 1, 5, 'vegano'),
('Compota de manzana', 'https://images.unsplash.com/photo-1570488344398-7c7e33c1f51f?w=600&h=400&fit=crop', 'Compota casera de manzana con canela y un toque de miel', 2, 20, 'vegano'),
('Ensalada de frutas tropicales', 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=400&fit=crop', 'Ensalada de mango, plátano, fresas y arándanos', 2, 8, 'vegano'),
('Barritas de avena y miel', 'https://images.unsplash.com/photo-1490567674984-2aa16c8e1dcc?w=600&h=400&fit=crop', 'Barritas energéticas caseras de avena, almendras y miel', 8, 20, NULL),
('Camarones al ajillo', 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=600&h=400&fit=crop', 'Camarones salteados con ajo, aceite de oliva y perejil', 2, 10, NULL),
('Ensalada de edamame y quinoa', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop', 'Quinoa con edamame, pepino, mango y aderezo de limón', 2, 20, 'vegano'),
('Bowl de pollo y quinoa', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop', 'Pollo a la plancha con quinoa, aguacate y verduras frescas', 2, 25, NULL),
('Salmón al horno con espárragos', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop', 'Salmón al horno con verduras asadas y quinoa', 2, 30, NULL),
('Pasta carbonara saludable', 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop', 'Pasta integral con salsa de yogur, huevo y parmesano', 3, 25, NULL),
('Ensalada de pollo y mango', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop', 'Ensalada fresca de pollo, mango y espinaca con vinagreta', 2, 15, NULL),
('Wok de verduras con tofu', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Salteado de tofu, brócoli, pimiento y zanahoria', 2, 20, 'vegano'),
('Arroz con pollo y verduras', 'https://images.unsplash.com/photo-1724441980118-741eaf55b0f8?w=600&h=400&fit=crop', 'Arroz salteado con pollo, pimiento y zanahoria', 3, 30, NULL),
('Crema de zanahoria y jengibre', 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&h=400&fit=crop', 'Crema suave de zanahoria con jengibre y leche de coco', 3, 30, 'vegano'),
('Pollo al horno con romero', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop', 'Pechuga de pollo al horno con romero, ajo y batata', 2, 35, NULL),
('Ensalada de quinoa y garbanzos', 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop', 'Quinoa con garbanzos, pepino, tomate y aderezo de limón', 2, 20, 'vegano'),
('Tortilla de espinaca y queso', 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&h=400&fit=crop', 'Tortilla esponjosa con espinaca y queso parmesano', 2, 15, NULL),
('Batido de avena y manzana', 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=400&fit=crop', 'Batido nutritivo de avena, manzana, canela y miel', 1, 5, NULL),
('Hummus de remolacha', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', 'Hummus vibrante de garbanzos y remolacha con vegetales', 2, 15, 'vegano'),
('Pollo agridulce', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop', 'Pollo salteado con salsa agridulce, pimiento y piña', 3, 25, NULL);

SELECT CONCAT('Total recetas: ', COUNT(*)) AS resultado FROM recipes;
