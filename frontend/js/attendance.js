/**
 * attendance.js — CMS PORTAL - Mini Project Attendance & Leave Module
 *
 * Handles:
 *  - Rendering pending leave request rows
 *  - Approve / Reject actions on leave requests
 *  - Export Report button
 *  - Mini calendar rendering (static for now)
 *
 * Data source: attendanceAPI (api.js) — falls back to static mock data.
 */

'use strict';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_LEAVE_REQUESTS = [
    {
        id: 'LR-001',
        name: 'Ezhil',
        team: 'Design Team',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYWlPwAsXa_a_J6vMfDfIPLiypSfWghjjMcaqcO_7vOGKTaTDNJuTz3j5Ibb9HZt109UkSd7JoaI8txVLdxlCT0wM2lFMNGbTLPeA6sTJxgxunHXFS4c-AAZ9zLPvSfqrPE-t9fn2Ms-HLl-GOqgkwnbfdRgzZvyGaC8FkgY4oWct0j_zIxrjhMgiwN1lMTKysCmSO2Ac-6t_pq8JfmqDK_MF72nyReAuvY-vyaJakUwdoVS_ZLX1FntpEuPTj0R5zsiGErnJF6dY',
        leaveType: 'Sick Leave',
        leaveClass: 'bg-rose-50 text-rose-700 border-rose-100',
        duration: '3 Days',
        range: 'Oct 24 - Oct 26',
    },
    {
        id: 'LR-002',
        name: 'Prem',
        team: 'Engineering',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwxbV2kKu56lH9G67wsOTXe1K867tEJxavBvU0375_YBMbH_wIj8mjb3zbO0UKwM6wzl-tlCt5JZqi3fAbTKJI5iAVfZm9IRXflmCAmtWK843uWCx-YasRwvSjqvn0Z3VDozr4v00xQSaOIZXrQ-2zxTFw5KHKuYe1a_5qqNTLme0cQzjJT0KplOaNOmpkBRA4x1t7WSwKnNlcLJcrIE1Fa9uvtWk5ar1DYug-QCmGqSmk6RUGk8Et7rZ8RV5MpWLMTgFucxB9ZgI',
        leaveType: 'Vacation',
        leaveClass: 'bg-blue-50 text-blue-700 border-blue-100',
        duration: '5 Days',
        range: 'Nov 01 - Nov 05',
    },
    {
        id: 'LR-003',
        name: 'Keerthana',
        team: 'Marketing',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtezuRqltfG6p7q1n2VARAl61AutUYh9kbAqUofIZuJUfH-Iu8-ncItEboRN99mEp_IKi5cjJJoO_i3gggQ0jMxdoKQduNrEbd_wdd3IFyPKd9L9JsJGy_oGmHKlYTcCh-KCCM9P70Mu47XX_mibzqGfI1jg7lm0ofCa5l1CB6TOGBcrQPlZhnfYTjbsmh5dWFvm05VAir_jv88AWX2RyIWngb4GWr1h0VZoL-I56jWCGt5-kvIdsiMxvwCSD53XslQi6mUZhn3KU',
        leaveType: 'Personal',
        leaveClass: 'bg-amber-50 text-amber-700 border-amber-100',
        duration: '1 Day',
        range: 'Oct 28',
    },
];

// ── State ─────────────────────────────────────────────────────────────────────

let leaveRequests = [...MOCK_LEAVE_REQUESTS];

// ── Render ────────────────────────────────────────────────────────────────────

function renderLeaveRequest(req) {
    return `
    <tr class="hover:bg-slate-50 transition-colors group" data-id="${req.id}">
        <td class="px-6 py-4">
            <div class="flex items-center gap-3">
                <img src="${req.avatar}" alt="${req.name}" class="w-9 h-9 rounded-full bg-slate-200 object-cover ring-2 ring-white shadow-sm"/>
                <div>
                    <div class="font-semibold text-slate-800 text-sm">${req.name}</div>
                    <div class="text-xs text-slate-500 mt-0.5">${req.team}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4">
            <span class="px-2.5 py-1 ${req.leaveClass} rounded text-xs font-semibold border uppercase tracking-wide">${req.leaveType}</span>
        </td>
        <td class="px-6 py-4">
            <div class="text-sm font-semibold text-slate-800">${req.duration}</div>
            <div class="text-xs text-slate-500 mt-0.5">${req.range}</div>
        </td>
        <td class="px-6 py-4 text-center">
            <div class="flex items-center justify-center gap-2">
                <button data-action="approve" data-id="${req.id}"
                    class="p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors focus:ring-2 focus:ring-emerald-500 outline-none" title="Approve">
                    <span class="material-symbols-outlined text-[20px]">check</span>
                </button>
                <button data-action="reject" data-id="${req.id}"
                    class="p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-md transition-colors focus:ring-2 focus:ring-rose-500 outline-none" title="Reject">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>
        </td>
    </tr>`;
}

function renderLeaveTable() {
    const tbody = document.querySelector('#leave-tbody');
    if (!tbody) return;
    tbody.innerHTML = leaveRequests.length
        ? leaveRequests.map(renderLeaveRequest).join('')
        : `<tr><td colspan="4" class="text-center py-12 text-slate-400 text-sm">No pending requests.</td></tr>`;
}

// ── Actions ───────────────────────────────────────────────────────────────────

function handleLeaveAction(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const { action, id } = btn.dataset;
    // TODO: call attendanceAPI.approveLeave(id) or attendanceAPI.rejectLeave(id)
    console.log(`[Attendance] ${action} leave request ${id}`);

    leaveRequests = leaveRequests.filter(r => r.id !== id);
    renderLeaveTable();
}

function handleExportReport() {
    // TODO: call attendanceAPI.exportReport() when backend ready
    alert('Attendance report export initiated! (Backend integration pending)');
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    renderLeaveTable();

    document.querySelector('#leave-tbody')?.addEventListener('click', handleLeaveAction);
    document.querySelector('#btn-export-report')?.addEventListener('click', handleExportReport);
});
