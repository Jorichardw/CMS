// routes/attendance.js
'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', ctrl.getRecords);
router.get('/export', ctrl.exportReport);
router.get('/leave-requests', ctrl.getLeaveRequests);
router.put('/leave-requests/:id/approve', ctrl.approveLeave);
router.put('/leave-requests/:id/reject', ctrl.rejectLeave);

module.exports = router;
