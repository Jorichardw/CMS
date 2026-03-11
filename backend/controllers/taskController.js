const db = require('../db/connection');

// GET /api/tasks (Supports filtering by status)
const getTasks = (req, res) => {
    const { status } = req.query;
    
    let query = 'SELECT * FROM tasks';
    let queryParams = [];

    if (status) {
        query += ' WHERE status = ?';
        queryParams.push(status);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
};

// POST /api/tasks
const createTask = (req, res) => {
    const { title, description, status, priority, assigned_to, deadline } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const taskStatus = status || 'todo';
    const taskPriority = priority || 'medium';

    db.query(
        'INSERT INTO tasks (title, description, status, priority, assigned_to, deadline) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, taskStatus, taskPriority, assigned_to, deadline],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'Task created successfully', taskId: results.insertId });
        }
    );
};

// PUT /api/tasks/:id
const updateTask = (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, assigned_to, deadline } = req.body;

    db.query(
        'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, assigned_to = ?, deadline = ? WHERE task_id = ?',
        [title, description, status, priority, assigned_to, deadline, id],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json({ message: 'Task updated successfully' });
        }
    );
};

// DELETE /api/tasks/:id
const deleteTask = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM tasks WHERE task_id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    });
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};
