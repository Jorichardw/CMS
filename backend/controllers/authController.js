// controllers/authController.js — Authentication logic
'use strict';
const db = require('../db/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET || 'cms_dev_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        if (!user || !(await bcrypt.compare(password, user.password_hash)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = signToken(user.id);
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) { next(err); }
};

exports.logout = (_req, res) => res.json({ message: 'Logged out successfully' });

exports.getMe = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT id, name, role, username FROM users WHERE id = ?', [req.user.id]);
        res.json(rows[0] || {});
    } catch (err) { next(err); }
};
