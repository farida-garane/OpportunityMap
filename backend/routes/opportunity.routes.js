const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunity.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', opportunityController.getAll);            // list + filters (?type=&field=&city=)
router.get('/:id', opportunityController.getById);         // single opportunity detail
router.post('/', authMiddleware, opportunityController.create);   // add a new opportunity
router.put('/:id', authMiddleware, opportunityController.update); // edit an opportunity
router.delete('/:id', authMiddleware, opportunityController.remove); // delete an opportunity

module.exports = router;