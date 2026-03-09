// routes/tasks.js
'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tasksController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.put('/:id/status', ctrl.move);
router.delete('/:id', ctrl.remove);

module.exports = router;
