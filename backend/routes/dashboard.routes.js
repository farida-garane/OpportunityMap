const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, dashboardController.getSummary);

module.exports = router;