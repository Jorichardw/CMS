const db = require('../db/connection');

// GET /api/attendance
const getAttendance = (req, res) => {
    const { employee_id, date } = req.query;

    let query = `
        SELECT a.attendance_id, a.employee_id, e.name as employee_name, a.date, a.status 
        FROM attendance a
        JOIN employees e ON a.employee_id = e.employee_id
    `;
    let queryParams = [];
    let conditions = [];

    if (employee_id) {
        conditions.push('a.employee_id = ?');
        queryParams.push(employee_id);
    }
    if (date) {
        conditions.push('a.date = ?');
        queryParams.push(date);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    // Order by most recent dates first
    query += ' ORDER BY a.date DESC';

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
};

// POST /api/attendance
const createAttendance = (req, res) => {
    const { employee_id, date, status } = req.body;

    if (!employee_id || !date || !status) {
        return res.status(400).json({ message: 'employee_id, date, and status are required' });
    }

    const validStatuses = ['Present', 'Leave', 'Late', 'WFH'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be one of: Present, Leave, Late, WFH' });
    }

    db.query(
        'INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)',
        [employee_id, date, status],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Attendance record for this employee and date already exists' });
                }
                if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                    return res.status(404).json({ message: 'Employee not found' });
                }
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'Attendance record created successfully', attendanceId: results.insertId });
        }
    );
};

// PUT /api/attendance/:id
const updateAttendance = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'status is required' });
    }

    const validStatuses = ['Present', 'Leave', 'Late', 'WFH'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be one of: Present, Leave, Late, WFH' });
    }

    db.query(
        'UPDATE attendance SET status = ? WHERE attendance_id = ?',
        [status, id],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Attendance record not found' });
            }
            res.json({ message: 'Attendance record updated successfully' });
        }
    );
};

module.exports = {
    getAttendance,
    createAttendance,
    updateAttendance
};
