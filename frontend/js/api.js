/**
 * api.js — CMS PORTAL - Mini Project API Client
 *
 * Centralised fetch wrapper for all backend API calls.
 * Base URL should point to the Express server (backend/server.js).
 *
 * Usage:
 *   import { get, post, put, del } from './api.js';
 *   const employees = await get('/api/employees');
 */

'use strict';

const API_BASE = 'http://localhost:3000';  // Change to your deployed URL in production

// ── Generic Fetch Helper ──────────────────────────────────────────────────────

async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Attach auth token if present
    const token = sessionStorage.getItem('cms_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { ...options, headers };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        // 204 No Content
        if (response.status === 204) return null;

        return response.json();
    } catch (err) {
        console.error(`[API] ${options.method || 'GET'} ${endpoint} failed:`, err.message);
        throw err;
    }
}

// ── HTTP Method Shortcuts ─────────────────────────────────────────────────────

export const get = (endpoint) => request(endpoint, { method: 'GET' });
export const post = (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) });
export const put = (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
export const del = (endpoint) => request(endpoint, { method: 'DELETE' });

// ── Auth Endpoints ────────────────────────────────────────────────────────────

export const authAPI = {
    login: (credentials) => post('/api/auth/login', credentials),
    logout: () => post('/api/auth/logout'),
    me: () => get('/api/auth/me'),
};

// ── Employee Endpoints ────────────────────────────────────────────────────────

export const employeesAPI = {
    getAll: (params = '') => get(`/api/employees${params}`),
    getById: (id) => get(`/api/employees/${id}`),
    create: (data) => post('/api/employees', data),
    update: (id, data) => put(`/api/employees/${id}`, data),
    remove: (id) => del(`/api/employees/${id}`),
    runPayroll: () => post('/api/employees/payroll/run'),
    exportCSV: () => get('/api/employees/export/csv'),
};

// ── Attendance Endpoints ──────────────────────────────────────────────────────

export const attendanceAPI = {
    getRecords: (params = '') => get(`/api/attendance${params}`),
    getRequests: () => get('/api/attendance/leave-requests'),
    approveLeave: (id) => put(`/api/attendance/leave-requests/${id}/approve`),
    rejectLeave: (id) => put(`/api/attendance/leave-requests/${id}/reject`),
    exportReport: () => get('/api/attendance/export'),
};

// ── Task Endpoints ────────────────────────────────────────────────────────────

export const tasksAPI = {
    getAll: (params = '') => get(`/api/tasks${params}`),
    getById: (id) => get(`/api/tasks/${id}`),
    create: (data) => post('/api/tasks', data),
    update: (id, data) => put(`/api/tasks/${id}`, data),
    remove: (id) => del(`/api/tasks/${id}`),
    move: (id, status) => put(`/api/tasks/${id}/status`, { status }),
};

// ── Analytics Endpoints ───────────────────────────────────────────────────────

export const analyticsAPI = {
    getFinancialOverview: () => get('/api/analytics/financial'),
    getExpenditureBreakdown: () => get('/api/analytics/expenditure'),
    runReport: (params) => post('/api/analytics/report', params),
    downloadReport: (format) => get(`/api/analytics/report/download?format=${format}`),
};
