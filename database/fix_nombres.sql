USE tasteflow;

-- Corregir nombres con acentos que se guardaron mal
UPDATE recipes SET name = 'Salmón con quinoa' WHERE id = 17 AND name LIKE '%Salm%';
UPDATE recipes SET name = 'Crema de calabacín' WHERE id = 27 AND name LIKE '%calabac%';
UPDATE recipes SET name = 'Bowl de arroz con champiñones' WHERE id = 30 AND name LIKE '%champi%';
UPDATE recipes SET name = 'Pasta con brócoli y ajo' WHERE id = 42 AND name LIKE '%br%C3%B3coli%' OR (id = 42 AND name LIKE '%br%coli%');
UPDATE recipes SET name = 'Sopa fría de pepino' WHERE id = 46 AND name LIKE '%fr%a%';
UPDATE recipes SET name = 'Salmón al horno con espárragos' WHERE id = 59 AND name LIKE '%Salm%';
UPDATE recipes SET name = 'Merluza con puré de batata' WHERE id = 40 AND name LIKE '%pur%';
UPDATE recipes SET name = 'Tortilla de calabacín' WHERE id = 44 AND name LIKE '%calabac%';

-- Verificar nombres con problemas
SELECT id, name, HEX(name) FROM recipes WHERE name REGEXP '[^\x20-\x7E]' OR name LIKE '%??%' OR name LIKE '%�%' LIMIT 20;
