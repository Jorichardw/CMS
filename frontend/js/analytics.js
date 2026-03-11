/**
 * analytics.js — CMS PORTAL - Mini Project Analytics
 *
 * Modified to dynamically aggregate backend data and map it out across 
 * interactive visual representations utilizing Chart.js integration.
 */

'use strict';

const API_BASE = 'http://localhost:5000/api';
let deptChartInstance = null;
let taskChartInstance = null;
let attendanceChartInstance = null;

async function fetchWithAuth(endpoint) {
    const token = sessionStorage.getItem('cms_token') || localStorage.getItem('token') || '';
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function loadAnalytics() {
    try {
        // Fetch arrays from backend independently via Promise.all
        const [employees, tasks, attendance] = await Promise.all([
            fetchWithAuth('/employees'),
            fetchWithAuth('/tasks'),
            fetchWithAuth('/attendance')
        ]);

        renderDeptChart(employees);
        renderTaskChart(tasks);
        renderAttendanceChart(attendance);
    } catch (err) {
        console.error('Error loading analytics:', err);
    }
}

function renderDeptChart(employees) {
    const ctx = document.getElementById('deptChart');
    if (!ctx) return;

    const depts = {};
    employees.forEach(emp => {
        depts[emp.department] = (depts[emp.department] || 0) + 1;
    });

    if (deptChartInstance) deptChartInstance.destroy();

    deptChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(depts),
            datasets: [{
                data: Object.values(depts),
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#3b82f6'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            }
        }
    });
}

function renderTaskChart(tasks) {
    const ctx = document.getElementById('taskChart');
    if (!ctx) return;

    const statuses = { todo: 0, in_progress: 0, review: 0, done: 0 };
    tasks.forEach(t => {
        if (statuses[t.status] !== undefined) statuses[t.status]++;
    });

    if (taskChartInstance) taskChartInstance.destroy();

    taskChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['To Do', 'In Progress', 'Review', 'Done'],
            datasets: [{
                data: [statuses.todo, statuses.in_progress, statuses.review, statuses.done],
                backgroundColor: ['#94a3b8', '#6366f1', '#f59e0b', '#10b981'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            }
        }
    });
}

function renderAttendanceChart(attendance) {
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;

    const stats = { Present: 0, Leave: 0, Late: 0, WFH: 0 };
    attendance.forEach(a => {
        if (stats[a.status] !== undefined) stats[a.status]++;
    });

    if (attendanceChartInstance) attendanceChartInstance.destroy();

    attendanceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Present', 'Leave', 'Late', 'WFH'],
            datasets: [{
                label: 'Records Count',
                data: [stats.Present, stats.Leave, stats.Late, stats.WFH],
                backgroundColor: ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6'],
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { stepSize: 1 } 
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// ── Interactive UI Stubs
function handleRunReport(e) { 
    e.preventDefault(); 
    alert("Report generation workflow triggered! (Exporting currently disabled in mini-project mode)"); 
}

function handleShare() { 
    alert("Share intent captured."); 
}

function handleDownloadSummary() { 
    alert("Summary PDF download will begin shortly."); 
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#report-form')?.addEventListener('submit', handleRunReport);
    document.querySelector('#btn-run-report')?.addEventListener('click', handleRunReport);
    document.querySelector('#btn-share')?.addEventListener('click', handleShare);
    document.querySelector('#btn-download-summary')?.addEventListener('click', handleDownloadSummary);

    // Boot Data
    loadAnalytics();
});
