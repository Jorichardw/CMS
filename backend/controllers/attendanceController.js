// controllers/attendanceController.js
'use strict';
const db = require('../db/connection');

exports.getRecords = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM attendance ORDER BY date DESC LIMIT 100');
        res.json(rows);
    } catch (err) { next(err); }
};

exports.getLeaveRequests = async (_req, res, next) => {
    try {
        const [rows] = await db.query(
            "SELECT lr.*, e.name, e.department FROM leave_requests lr JOIN employees e ON lr.employee_id = e.id WHERE lr.status = 'Pending'"
        );
        res.json(rows);
    } catch (err) { next(err); }
};

exports.approveLeave = async (req, res, next) => {
    try {
        await db.query("UPDATE leave_requests SET status='Approved' WHERE id=?", [req.params.id]);
        res.json({ message: 'Leave approved' });
    } catch (err) { next(err); }
};

exports.rejectLeave = async (req, res, next) => {
    try {
        await db.query("UPDATE leave_requests SET status='Rejected' WHERE id=?", [req.params.id]);
        res.json({ message: 'Leave rejected' });
    } catch (err) { next(err); }
};

exports.exportReport = async (_req, res, next) => {
    try {
        const [rows] = await db.query('SELECT e.name, a.date, a.status, a.check_in, a.check_out FROM attendance a JOIN employees e ON a.employee_id = e.id ORDER BY a.date DESC');
        const header = 'Name,Date,Status,Check-In,Check-Out';
        const lines = rows.map(r => `${r.name},${r.date},${r.status},${r.check_in},${r.check_out}`);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.csv"');
        res.send([header, ...lines].join('\n'));
    } catch (err) { next(err); }
};
