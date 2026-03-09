// controllers/employeesController.js — Employee & Payroll CRUD
'use strict';
const db = require('../db/connection');

exports.getAll = async (req, res, next) => {
    try {
        const { dept, search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        let sql = 'SELECT * FROM employees WHERE 1=1';
        const params = [];
        if (dept) { sql += ' AND department = ?'; params.push(dept); }
        if (search) { sql += ' AND (name LIKE ? OR employee_id LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
        sql += ' LIMIT ? OFFSET ?';
        params.push(Number(limit), Number(offset));
        const [rows] = await db.query(sql, params);
        const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM employees');
        res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
    } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ message: 'Employee not found' });
        res.json(rows[0]);
    } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
    try {
        const { name, employee_id, department, status, salary } = req.body;
        const [result] = await db.query(
            'INSERT INTO employees (name, employee_id, department, status, salary) VALUES (?,?,?,?,?)',
            [name, employee_id, department, status || 'Active', salary]
        );
        res.status(201).json({ id: result.insertId, message: 'Employee created' });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        const { name, department, status, salary, payroll_status } = req.body;
        await db.query(
            'UPDATE employees SET name=?, department=?, status=?, salary=?, payroll_status=? WHERE id=?',
            [name, department, status, salary, payroll_status, req.params.id]
        );
        res.json({ message: 'Employee updated' });
    } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
    try {
        await db.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
        res.status(204).end();
    } catch (err) { next(err); }
};

exports.runPayroll = async (_req, res, next) => {
    try {
        await db.query("UPDATE employees SET payroll_status='Processing' WHERE payroll_status='Pending'");
        res.json({ message: 'Payroll run initiated for all pending employees' });
    } catch (err) { next(err); }
};

exports.exportCSV = async (_req, res, next) => {
    try {
        const [rows] = await db.query('SELECT employee_id, name, department, status, salary, payroll_status FROM employees');
        const header = 'ID,Name,Department,Status,Salary,Payroll Status';
        const lines = rows.map(r => `${r.employee_id},${r.name},${r.department},${r.status},${r.salary},${r.payroll_status}`);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="employees.csv"');
        res.send([header, ...lines].join('\n'));
    } catch (err) { next(err); }
};
