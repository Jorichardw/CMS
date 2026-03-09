// routes/employees.js
'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employeesController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', ctrl.getAll);
router.get('/export/csv', ctrl.exportCSV);
router.post('/payroll/run', ctrl.runPayroll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
