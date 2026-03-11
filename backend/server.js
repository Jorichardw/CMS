const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_here';
const PORT = process.env.PORT || 5000;

// Database Connection
const dbConfig = process.env.DATABASE_URL || { host: 'localhost', user: 'root', password: 'root', database: 'cms_portal' };
const pool = mysql.createPool(dbConfig);

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    try { req.user = jwt.verify(token, JWT_SECRET); next(); }
    catch { res.status(403).json({ message: 'Invalid token' }); }
};

// Async Wrapper to catch errors and remove boilerplate try/catch
const wrap = fn => (req, res, next) => fn(req, res, next).catch(err => {
    console.error(err); res.status(500).json({ message: 'Server error' });
});

// ==========================================
// ROUTES
// ==========================================

// --- Auth ---
app.post('/api/auth/register', wrap(async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Required fields missing' });
    const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length) return res.status(400).json({ message: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role || 'employee']);
    res.status(201).json({ message: 'Registered' });
}));

app.post('/api/auth/login', wrap(async (req, res) => {
    const { username, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!users.length || !(await bcrypt.compare(password, users[0].password))) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: users[0].user_id, username, role: users[0].role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token });
}));

app.use('/api', auth); // Protect all below

// --- Employees ---
app.get('/api/employees', wrap(async (req, res) => {
    const { dept, search, page = 1, limit = 10 } = req.query;
    let sql = 'SELECT * FROM employees WHERE 1=1', params = [];
    if (dept) { sql += ' AND department = ?'; params.push(dept); }
    if (search) { sql += ' AND (name LIKE ? OR employee_id LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    sql += ' LIMIT ? OFFSET ?'; params.push(Number(limit), (page - 1) * limit);
    const [rows] = await pool.query(sql, params);
    
    // Check old behavior: wait, the frontend api.js directly maps over the response data.
    // The previous controller returned { data: rows, total, page, limit }.
    // BUT frontend code checked `response.json()` and mapped directly over the array (`data.map(emp => ...)`). 
    // This implies `data` MUST be the array or the frontend is treating the root response as an array.
    // In employeesController.js it sent `res.json({ data: rows })`. BUT in frontend `employees.js` we saw:
    // const data = await response.json(); allEmployees = data.map(...) which only works if `res.json(rows)` is sent!
    // So the previous controller might have been a mismatch. Let's send the array directly as per frontend expectation.
    res.json(rows);
}));

app.post('/api/employees/payroll/run', wrap(async (req, res) => {
    await pool.query("UPDATE employees SET payroll_status='Processing' WHERE payroll_status='Pending'");
    res.json({ message: 'Payroll run' });
}));

app.get('/api/employees/export/csv', wrap(async (req, res) => {
    const [rows] = await pool.query('SELECT employee_id, name, department, status, salary, payroll_status FROM employees');
    res.setHeader('Content-Type', 'text/csv').setHeader('Content-Disposition', 'attachment; filename="employees.csv"').send(
        ['ID,Name,Department,Status,Salary,Payroll Status', ...rows.map(r => `${r.employee_id},${r.name},${r.department},${r.status},${r.salary},${r.payroll_status}`)].join('\n')
    );
}));

app.post('/api/employees', wrap(async (req, res) => {
    const { name, employee_id, department, status, salary } = req.body;
    const [r] = await pool.query('INSERT INTO employees (name, employee_id, department, status, salary) VALUES (?,?,?,?,?)', [name, employee_id, department, status || 'Active', salary]);
    res.status(201).json({ id: r.insertId });
}));

app.route('/api/employees/:id')
   .get(wrap(async (req, res) => { const [r] = await pool.query('SELECT * FROM employees WHERE id=?', [req.params.id]); res.json(r[0] || {}); }))
   .put(wrap(async (req, res) => {
        const { name, department, status, salary, payroll_status } = req.body;
        await pool.query('UPDATE employees SET name=?, department=?, status=?, salary=?, payroll_status=? WHERE id=?', [name, department, status, salary, payroll_status, req.params.id]);
        res.json({ message: 'Updated' });
   }))
   .delete(wrap(async (req, res) => { await pool.query('DELETE FROM employees WHERE id=?', [req.params.id]); res.status(204).end(); }));

// --- Tasks ---
app.route('/api/tasks')
   .get(wrap(async (req, res) => {
        let sql = 'SELECT * FROM tasks', params = [];
        if (req.query.status) { sql += ' WHERE status=?'; params.push(req.query.status); }
        const [rows] = await pool.query(sql, params); res.json(rows);
   }))
   .post(wrap(async (req, res) => {
        const { title, description, status='todo', priority='medium', assigned_to, deadline } = req.body;
        const [r] = await pool.query('INSERT INTO tasks (title, description, status, priority, assigned_to, deadline) VALUES (?,?,?,?,?,?)', [title, description, status, priority, assigned_to, deadline]);
        res.status(201).json({ taskId: r.insertId });
   }));

app.route('/api/tasks/:id')
   .put(wrap(async (req, res) => {
        const { title, description, status, priority, assigned_to, deadline } = req.body;
        await pool.query('UPDATE tasks SET title=?, description=?, status=?, priority=?, assigned_to=?, deadline=? WHERE task_id=?', [title, description, status, priority, assigned_to, deadline, req.params.id]);
        res.json({ message: 'Updated' });
   }))
   .delete(wrap(async (req, res) => { await pool.query('DELETE FROM tasks WHERE task_id=?', [req.params.id]); res.json({}); }));

app.put('/api/tasks/:id/status', wrap(async (req, res) => {
    await pool.query('UPDATE tasks SET status=? WHERE task_id=?', [req.body.status, req.params.id]); res.json({});
}));

// --- Attendance ---
app.get('/api/attendance/leave-requests', (req, res) => res.json([
    { id: 'LR-001', name: 'Ezhil', team: 'Design', type: 'Sick Leave', duration: '3 Days', range: 'Oct 24 - Oct 26', status: 'Pending' },
    { id: 'LR-002', name: 'Prem', team: 'Engineering', type: 'Vacation', duration: '5 Days', range: 'Nov 01 - Nov 05', status: 'Pending' }
]));

app.put('/api/attendance/leave-requests/:id/:act', (req, res) => res.json({ message: `${req.params.id} ${req.params.act}` }));

app.route('/api/attendance')
   .get(wrap(async (req, res) => {
        let sql = 'SELECT a.*, e.name as employee_name FROM attendance a JOIN employees e ON a.employee_id=e.employee_id', p = [], c = [];
        if (req.query.employee_id) { c.push('a.employee_id=?'); p.push(req.query.employee_id); }
        if (req.query.date) { c.push('a.date=?'); p.push(req.query.date); }
        if (c.length) sql += ' WHERE ' + c.join(' AND ');
        const [rows] = await pool.query(sql + ' ORDER BY a.date DESC', p); res.json(rows);
   }))
   .post(wrap(async (req, res) => {
        const { employee_id, date, status } = req.body;
        try {
            const [r] = await pool.query('INSERT INTO attendance (employee_id, date, status) VALUES (?,?,?)', [employee_id, date, status]);
            res.status(201).json({ id: r.insertId });
        } catch(e) { res.status(e.code==='ER_DUP_ENTRY'?409:500).json({ message: 'Error' }); }
   }));

app.put('/api/attendance/:id', wrap(async (req, res) => {
    await pool.query('UPDATE attendance SET status=? WHERE attendance_id=?', [req.body.status, req.params.id]); res.json({});
}));

app.get('/api/attendance/export', wrap(async (req, res) => {
    const [rows] = await pool.query('SELECT a.*, e.name FROM attendance a JOIN employees e ON a.employee_id=e.employee_id ORDER BY a.date DESC');
    res.setHeader('Content-Type', 'text/csv').setHeader('Content-Disposition', 'attachment; filename="attendance.csv"').send(
        ['ID,Name,Date,Status', ...rows.map(r => `${r.attendance_id},${r.name},${new Date(r.date).toLocaleDateString()},${r.status}`)].join('\n')
    );
}));

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log('Server running on port ' + PORT));
}

module.exports = app;
