USE tasteflow;

UPDATE recipes SET photo_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop' WHERE id % 8 = 1;
UPDATE recipes SET photo_url = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop' WHERE id % 8 = 2;
UPDATE recipes SET photo_url = 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop' WHERE id % 8 = 3;
UPDATE recipes SET photo_url = 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop' WHERE id % 8 = 4;
UPDATE recipes SET photo_url = 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&h=400&fit=crop' WHERE id % 8 = 5;
UPDATE recipes SET photo_url = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop' WHERE id % 8 = 6;
UPDATE recipes SET photo_url = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop' WHERE id % 8 = 7;
UPDATE recipes SET photo_url = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop' WHERE id % 8 = 0;

SELECT CONCAT('URLs actualizadas para ', COUNT(*), ' recetas') AS resultado FROM recipes WHERE photo_url IS NOT NULL;
