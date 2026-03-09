// controllers/analyticsController.js
'use strict';
const db = require('../db/connection');

exports.getFinancialOverview = async (_req, res, next) => {
    try {
        const [rows] = await db.query('SELECT month, revenue, costs FROM financial_overview ORDER BY month_order');
        res.json(rows);
    } catch (err) { next(err); }
};

exports.getExpenditureBreakdown = async (_req, res, next) => {
    try {
        const [rows] = await db.query('SELECT department, percentage FROM expenditure_breakdown');
        res.json(rows);
    } catch (err) { next(err); }
};

exports.runReport = async (req, res, next) => {
    try {
        const { module: mod, dateRange, format } = req.body;
        // Stub — extend with real query logic per module
        res.json({ status: 'generated', module: mod, dateRange, format, message: 'Report ready for download' });
    } catch (err) { next(err); }
};

exports.downloadReport = async (req, res, next) => {
    try {
        const format = req.query.format || 'pdf';
        // Stub — integrate with PDF/Excel library (e.g. pdfkit, exceljs)
        res.json({ message: `${format.toUpperCase()} download stub`, format });
    } catch (err) { next(err); }
};
