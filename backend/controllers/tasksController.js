// controllers/tasksController.js
'use strict';
const db = require('../db/connection');

exports.getAll = async (req, res, next) => {
    try {
        const { status } = req.query;
        let sql = 'SELECT * FROM tasks';
        const params = [];
        if (status) { sql += ' WHERE status = ?'; params.push(status); }
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ message: 'Task not found' });
        res.json(rows[0]);
    } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
    try {
        const { title, category, priority, status, due_date, assigned_to, progress } = req.body;
        const [result] = await db.query(
            'INSERT INTO tasks (title, category, priority, status, due_date, assigned_to, progress) VALUES (?,?,?,?,?,?,?)',
            [title, category, priority, status || 'todo', due_date, assigned_to, progress || 0]
        );
        res.status(201).json({ id: result.insertId, message: 'Task created' });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        const { title, category, priority, status, due_date, assigned_to, progress } = req.body;
        await db.query(
            'UPDATE tasks SET title=?, category=?, priority=?, status=?, due_date=?, assigned_to=?, progress=? WHERE id=?',
            [title, category, priority, status, due_date, assigned_to, progress, req.params.id]
        );
        res.json({ message: 'Task updated' });
    } catch (err) { next(err); }
};

exports.move = async (req, res, next) => {
    try {
        await db.query('UPDATE tasks SET status=? WHERE id=?', [req.body.status, req.params.id]);
        res.json({ message: 'Task status updated' });
    } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
    try {
        await db.query('DELETE FROM tasks WHERE id=?', [req.params.id]);
        res.status(204).end();
    } catch (err) { next(err); }
};
