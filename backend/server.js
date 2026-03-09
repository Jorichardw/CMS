/**
 * server.js — CMS PORTAL - Mini Project Express Backend
 *
 * Entry point. Starts the HTTP server, connects to MySQL,
 * and mounts all route modules.
 *
 * Usage:
 *   npm install
 *   npm run dev    (nodemon)
 *   npm start      (production)
 */

'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');
const taskRoutes = require('./routes/tasks');
const analyticsRoutes = require('./routes/analytics');

const { notFound, errorHandler } = require('./middleware/errorHandler');

// ── App Setup ─────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 3000;

// ── Global Middleware ─────────────────────────────────────────────────────────

app.use(helmet());                                    // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// ── Static Frontend (optional — for direct deployment) ────────────────────────

app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Error Handling ────────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────

app.listen(PORT, () => {
    console.log(`[CMS] Server running on http://localhost:${PORT}`);
});

module.exports = app;
