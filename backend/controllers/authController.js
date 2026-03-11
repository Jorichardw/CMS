const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');

const register = (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if user already exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Hashing error:', err);
                return res.status(500).json({ message: 'Error hashing password' });
            }

            const userRole = role || 'employee';

            // Insert into DB
            db.query(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                [username, hashedPassword, userRole],
                (err, insertResults) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ message: 'Database error' });
                    }

                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt error:', err);
                return res.status(500).json({ message: 'Error verifying password' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT (24 hours expiration)
            const secret = process.env.JWT_SECRET || 'your_super_secret_key_here';
            const payload = { id: user.user_id, username: user.username, role: user.role };
            
            jwt.sign(payload, secret, { expiresIn: '24h' }, (err, token) => {
                if (err) {
                    console.error('JWT error:', err);
                    return res.status(500).json({ message: 'Error generating token' });
                }

                res.json({ message: 'Login successful', token });
            });
        });
    });
};

module.exports = {
    register,
    login
};
