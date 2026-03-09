// routes/analytics.js
'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/financial', ctrl.getFinancialOverview);
router.get('/expenditure', ctrl.getExpenditureBreakdown);
router.post('/report', ctrl.runReport);
router.get('/report/download', ctrl.downloadReport);

module.exports = router;
