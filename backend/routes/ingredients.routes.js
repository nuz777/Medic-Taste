const { Router } = require('express');
const ctrl = require('../controllers/ingredients.controller');

const router = Router();

router.get('/', ctrl.getAll);
router.get('/categories', ctrl.getCategories);

module.exports = router;
