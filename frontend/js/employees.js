/**
 * employees.js — CMS PORTAL - Mini Project Employee & Payroll Module
 *
 * Handles:
 *  - Rendering the employee table
 *  - Client-side search & department filter
 *  - Pagination
 *  - Export CSV button
 *  - Run Payroll button
 *
 * Data source: employeesAPI (api.js) — falls back to static mock data
 * when no backend is available.
 */

'use strict';

// ── Mock Data (used until backend is connected) ───────────────────────────────

const MOCK_EMPLOYEES = [
    {
        id: 'CMS-1024',
        name: 'Prem',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlfxR8DcH7Va0wy6YmuUkjRm6Z1vfMAaajOKQX_PP48uR6uM3rbDzIC8fTWwWIpWw34LFK8HkCOsJnqGh4rO4fipHRcpe_7x7q68muopeApVl_dz23dX_Agdl3p1VArqeKxZvJXGTLJf4FDbHV1_yFoOhgx5RKecRKWWLNuaF0eqXpI3v3CVL8TOpKHS1risYgGUW3oq26fnlsMR2DXY-1am2GlRZOl2yWtfh3pew__Y32trOB76rlma3d6N9UiATq1BBcgea2a54',
        department: 'Engineering',
        status: 'Active',
        salary: 8400,
        payrollStatus: 'Paid',
    },
    {
        id: 'CMS-1102',
        name: 'Ezhil',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYWlPwAsXa_a_J6vMfDfIPLiypSfWghjjMcaqcO_7vOGKTaTDNJuTz3j5Ibb9HZt109UkSd7JoaI8txVLdxlCT0wM2lFMNGbTLPeA6sTJxgxunHXFS4c-AAZ9zLPvSfqrPE-t9fn2Ms-HLl-GOqgkwnbfdRgzZvyGaC8FkgY4oWct0j_zIxrjhMgiwN1lMTKysCmSO2Ac-6t_pq8JfmqDK_MF72nyReAuvY-vyaJakUwdoVS_ZLX1FntpEuPTj0R5zsiGErnJF6dY',
        department: 'Design',
        status: 'Active',
        salary: 7200,
        payrollStatus: 'Processing',
    },
    {
        id: 'CMS-1056',
        name: 'Keerthana',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtezuRqltfG6p7q1n2VARAl61AutUYh9kbAqUofIZuJUfH-Iu8-ncItEboRN99mEp_IKi5cjJJoO_i3gggQ0jMxdoKQduNrEbd_wdd3IFyPKd9L9JsJGy_oGmHKlYTcCh-KCCM9P70Mu47XX_mibzqGfI1jg7lm0ofCa5l1CB6TOGBcrQPlZhnfYTjbsmh5dWFvm05VAir_jv88AWX2RyIWngb4GWr1h0VZoL-I56jWCGt5-kvIdsiMxvwCSD53XslQi6mUZhn3KU',
        department: 'Engineering',
        status: 'On Leave',
        salary: 9100,
        payrollStatus: 'Pending',
    },
];

// ── State ─────────────────────────────────────────────────────────────────────

let allEmployees = [...MOCK_EMPLOYEES];
let filteredEmployees = [...allEmployees];
let currentPage = 1;
const PAGE_SIZE = 10;

// ── Render Helpers ────────────────────────────────────────────────────────────

const DEPT_COLORS = {
    Engineering: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    Design: 'bg-purple-50 text-purple-700 border-purple-100',
    Marketing: 'bg-rose-50 text-rose-700 border-rose-100',
    DevOps: 'bg-green-50 text-green-700 border-green-100',
};

const PAYROLL_BADGES = {
    Paid: { classes: 'text-emerald-700 bg-emerald-50 border-emerald-100', icon: 'check_circle', label: 'Paid' },
    Processing: { classes: 'text-amber-700 bg-amber-50 border-amber-100', icon: 'sync', label: 'Processing' },
    Pending: { classes: 'text-slate-600 bg-slate-100 border-slate-200', icon: 'hourglass_empty', label: 'Pending' },
};

function renderStatusBadge(status) {
    const isActive = status === 'Active';
    const isOnLeave = status === 'On Leave';
    const color = isActive ? 'emerald' : isOnLeave ? 'slate' : 'rose';
    const dot = isActive ? 'bg-emerald-500' : isOnLeave ? 'bg-slate-300' : 'bg-rose-500';
    return `<div class="flex items-center gap-1.5 text-xs font-semibold text-${color}-600">
                <span class="w-2 h-2 rounded-full ${dot}"></span> ${status}
            </div>`;
}

function renderPayrollBadge(payrollStatus) {
    const badge = PAYROLL_BADGES[payrollStatus] || PAYROLL_BADGES['Pending'];
    return `<span class="inline-flex items-center gap-1 ${badge.classes} border px-2.5 py-1 rounded text-xs font-semibold">
                <span class="material-symbols-outlined text-[14px]">${badge.icon}</span> ${badge.label}
            </span>`;
}

function renderRow(emp) {
    const deptClass = DEPT_COLORS[emp.department] || 'bg-slate-100 text-slate-700 border-slate-200';
    return `
    <tr class="hover:bg-slate-50 transition-colors group" data-id="${emp.id}">
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-3">
                <img src="${emp.avatar}" alt="${emp.name}" class="w-10 h-10 rounded-full bg-slate-200 object-cover ring-2 ring-white shadow-sm" />
                <div>
                    <div class="font-semibold text-slate-800 text-sm">${emp.name}</div>
                    <div class="text-xs text-slate-500 mt-0.5">ID: ${emp.id}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2.5 py-1 ${deptClass} rounded text-xs font-semibold border uppercase tracking-wide">${emp.department}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">${renderStatusBadge(emp.status)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">₹${emp.salary.toLocaleString('en-IN')}</td>
        <td class="px-6 py-4 whitespace-nowrap text-right">${renderPayrollBadge(emp.payrollStatus)}</td>
        <td class="px-4 py-4 whitespace-nowrap text-center">
            <button class="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none">
                <span class="material-symbols-outlined">more_vert</span>
            </button>
        </td>
    </tr>`;
}

function renderTable() {
    const tbody = document.querySelector('#employee-tbody');
    if (!tbody) return;

    const start = (currentPage - 1) * PAGE_SIZE;
    const page = filteredEmployees.slice(start, start + PAGE_SIZE);

    tbody.innerHTML = page.length
        ? page.map(renderRow).join('')
        : `<tr><td colspan="6" class="text-center py-12 text-slate-400 text-sm">No employees found.</td></tr>`;

    // Update pagination text
    const totalEl = document.querySelector('#emp-total');
    const fromEl = document.querySelector('#emp-from');
    const toEl = document.querySelector('#emp-to');
    if (totalEl) totalEl.textContent = filteredEmployees.length.toLocaleString('en-IN');
    if (fromEl) fromEl.textContent = filteredEmployees.length ? start + 1 : 0;
    if (toEl) toEl.textContent = Math.min(start + PAGE_SIZE, filteredEmployees.length);

    // Pagination buttons
    document.querySelector('#emp-prev')?.toggleAttribute('disabled', currentPage === 1);
    document.querySelector('#emp-next')?.toggleAttribute('disabled', start + PAGE_SIZE >= filteredEmployees.length);
}

// ── Filter Logic ──────────────────────────────────────────────────────────────

function applyFilters() {
    const query = document.querySelector('#emp-search')?.value.toLowerCase() || '';
    const dept = document.querySelector('#emp-dept-filter')?.value || 'All Departments';

    filteredEmployees = allEmployees.filter(emp => {
        const matchQuery = emp.name.toLowerCase().includes(query)
            || emp.id.toLowerCase().includes(query)
            || emp.department.toLowerCase().includes(query);
        const matchDept = dept === 'All Departments' || emp.department === dept;
        return matchQuery && matchDept;
    });

    currentPage = 1;
    renderTable();
}

// ── Actions ───────────────────────────────────────────────────────────────────

function handleRunPayroll() {
    // TODO: replace with employeesAPI.runPayroll() when backend ready
    alert('Payroll run initiated! (Backend integration pending)');
}

function handleExportCSV() {
    // Build CSV from current filtered data
    const headers = ['ID,Name,Department,Status,Salary,Payroll Status'];
    const rows = filteredEmployees.map(e =>
        `${e.id},${e.name},${e.department},${e.status},${e.salary},${e.payrollStatus}`
    );
    const blob = new Blob([...headers, ...rows].join('\n'), { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'employees.csv' });
    a.click();
    URL.revokeObjectURL(url);
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = sessionStorage.getItem('cms_token') || localStorage.getItem('token') || '';
        const response = await fetch('http://localhost:5000/api/employees', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            // Map DB fields to UI fields
            allEmployees = data.map(emp => ({
                id: emp.employee_id,
                name: emp.name,
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlfxR8DcH7Va0wy6YmuUkjRm6Z1vfMAaajOKQX_PP48uR6uM3rbDzIC8fTWwWIpWw34LFK8HkCOsJnqGh4rO4fipHRcpe_7x7q68muopeApVl_dz23dX_Agdl3p1VArqeKxZvJXGTLJf4FDbHV1_yFoOhgx5RKecRKWWLNuaF0eqXpI3v3CVL8TOpKHS1risYgGUW3oq26fnlsMR2DXY-1am2GlRZOl2yWtfh3pew__Y32trOB76rlma3d6N9UiATq1BBcgea2a54',
                department: emp.department,
                status: emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : 'Inactive',
                salary: parseFloat(emp.salary),
                payrollStatus: 'Paid',
            }));
            filteredEmployees = [...allEmployees];
        } else {
            console.error('Failed to fetch employees. Status:', response.status);
        }
    } catch (err) {
        console.error('Error fetching employees:', err);
    }

    renderTable();

    document.querySelector('#emp-search')?.addEventListener('input', applyFilters);
    document.querySelector('#emp-dept-filter')?.addEventListener('change', applyFilters);
    document.querySelector('#btn-run-payroll')?.addEventListener('click', handleRunPayroll);
    document.querySelector('#btn-export-csv')?.addEventListener('click', handleExportCSV);

    document.querySelector('#emp-prev')?.addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderTable(); }
    });
    document.querySelector('#emp-next')?.addEventListener('click', () => {
        if ((currentPage * PAGE_SIZE) < filteredEmployees.length) { currentPage++; renderTable(); }
    });
});
