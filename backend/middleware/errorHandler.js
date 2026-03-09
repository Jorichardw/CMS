// middleware/errorHandler.js — Centralised error handling
'use strict';

exports.notFound = (req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

exports.errorHandler = (err, _req, res, _next) => {
    console.error('[ERROR]', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || 'Internal server error' });
};
