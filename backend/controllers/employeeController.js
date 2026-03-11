const db = require('../db/connection');

// GET /api/employees
const getEmployees = (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
};

// POST /api/employees
const createEmployee = (req, res) => {
    const { name, department, salary, email, phone, status } = req.body;
    
    if (!name || !department || !salary || !email || !phone) {
        return res.status(400).json({ message: 'Name, department, salary, email, and phone are required' });
    }

    const employeeStatus = status || 'active';

    db.query(
        'INSERT INTO employees (name, department, salary, email, phone, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, department, salary, email, phone, employeeStatus],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Email already exists' });
                }
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'Employee created successfully', employeeId: results.insertId });
        }
    );
};

// PUT /api/employees/:id
const updateEmployee = (req, res) => {
    const { id } = req.params;
    const { name, department, salary, email, phone, status } = req.body;

    db.query(
        'UPDATE employees SET name = ?, department = ?, salary = ?, email = ?, phone = ?, status = ? WHERE employee_id = ?',
        [name, department, salary, email, phone, status, id],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Email already exists' });
                }
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.json({ message: 'Employee updated successfully' });
        }
    );
};

// DELETE /api/employees/:id
const deleteEmployee = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM employees WHERE employee_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    });
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};
