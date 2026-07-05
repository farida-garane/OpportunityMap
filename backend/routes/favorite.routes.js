const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, favoriteController.getMyFavorites);
router.post('/:opportunityId', authMiddleware, favoriteController.addFavorite);
router.delete('/:opportunityId', authMiddleware, favoriteController.removeFavorite);

module.exports = router;