const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect attendance endpoints
router.use(authMiddleware);

// Attendance endpoints
router.get('/', attendanceController.getAttendance);
router.post('/', attendanceController.createAttendance);
router.put('/:id', attendanceController.updateAttendance);

module.exports = router;
