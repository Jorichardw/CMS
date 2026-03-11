/**
 * main.js - CMS PORTAL - Mini Project Integrated Frontend Logic
 * Consolidates Employees, Attendance, Tasks, and Analytics modules.
 */

'use strict';

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlfxR8DcH7Va0wy6YmuUkjRm6Z1vfMAaajOKQX_PP48uR6uM3rbDzIC8fTWwWIpWw34LFK8HkCOsJnqGh4rO4fipHRcpe_7x7q68muopeApVl_dz23dX_Agdl3p1VArqeKxZvJXGTLJf4FDbHV1_yFoOhgx5RKecRKWWLNuaF0eqXpI3v3CVL8TOpKHS1risYgGUW3oq26fnlsMR2DXY-1am2GlRZOl2yWtfh3pew__Y32trOB76rlma3d6N9UiATq1BBcgea2a54';

const EmployeeModule = {
    allEmployees: [], filteredEmployees: [], currentPage: 1, PAGE_SIZE: 10,
    DEPT_COLORS: { Engineering: 'bg-indigo-50 text-indigo-700 border-indigo-100', Design: 'bg-purple-50 text-purple-700 border-purple-100', Marketing: 'bg-rose-50 text-rose-700 border-rose-100', DevOps: 'bg-green-50 text-green-700 border-green-100' },
    PAYROLL_BADGES: { Paid: { classes: 'text-emerald-700 bg-emerald-50 border-emerald-100', icon: 'check_circle', label: 'Paid' }, Processing: { classes: 'text-amber-700 bg-amber-50 border-amber-100', icon: 'sync', label: 'Processing' }, Pending: { classes: 'text-slate-600 bg-slate-100 border-slate-200', icon: 'hourglass_empty', label: 'Pending' } },
    renderBadge: function(status, type) {
        if (type === 'status') {
            const isActive = status === 'Active'; const isOnLeave = status === 'On Leave';
            const color = isActive ? 'emerald' : isOnLeave ? 'slate' : 'rose';
            const dot = isActive ? 'bg-emerald-500' : isOnLeave ? 'bg-slate-300' : 'bg-rose-500';
            return `<div class="flex items-center gap-1.5 text-xs font-semibold text-${color}-600"><span class="w-2 h-2 rounded-full ${dot}"></span> ${status}</div>`;
        } else {
            const b = this.PAYROLL_BADGES[status] || this.PAYROLL_BADGES['Pending'];
            return `<span class="inline-flex items-center gap-1 ${b.classes} border px-2.5 py-1 rounded text-xs font-semibold"><span class="material-symbols-outlined text-[14px]">${b.icon}</span> ${b.label}</span>`;
        }
    },
    renderTable: function() {
        const tbody = document.querySelector('#employee-tbody'); if (!tbody) return;
        const start = (this.currentPage - 1) * this.PAGE_SIZE;
        const page = this.filteredEmployees.slice(start, start + this.PAGE_SIZE);
        tbody.innerHTML = page.length ? page.map(e => `
        <tr class="hover:bg-slate-50 transition-colors group" data-id="${e.id}">
            <td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center gap-3"><img src="${e.avatar}" alt="${e.name}" class="w-10 h-10 rounded-full bg-slate-200 object-cover ring-2 ring-white shadow-sm" /><div><div class="font-semibold text-slate-800 text-sm">${e.name}</div><div class="text-xs text-slate-500 mt-0.5">ID: ${e.id}</div></div></div></td>
            <td class="px-6 py-4 whitespace-nowrap"><span class="px-2.5 py-1 ${this.DEPT_COLORS[e.department] || 'bg-slate-100 text-slate-700 border-slate-200'} rounded text-xs font-semibold border uppercase tracking-wide">${e.department}</span></td>
            <td class="px-6 py-4 whitespace-nowrap">${this.renderBadge(e.status, 'status')}</td><td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">₹${e.salary.toLocaleString('en-IN')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">${this.renderBadge(e.payrollStatus, 'payroll')}</td><td class="px-4 py-4 whitespace-nowrap text-center"><button class="text-slate-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none"><span class="material-symbols-outlined">more_vert</span></button></td>
        </tr>`).join('') : `<tr><td colspan="6" class="text-center py-12 text-slate-400 text-sm">No employees found.</td></tr>`;
        const setT = (id, v) => document.querySelector(id) && (document.querySelector(id).textContent = v);
        setT('#emp-total', this.filteredEmployees.length.toLocaleString('en-IN'));
        setT('#emp-from', this.filteredEmployees.length ? start + 1 : 0);
        setT('#emp-to', Math.min(start + this.PAGE_SIZE, this.filteredEmployees.length));
        document.querySelector('#emp-prev')?.toggleAttribute('disabled', this.currentPage === 1);
        document.querySelector('#emp-next')?.toggleAttribute('disabled', start + this.PAGE_SIZE >= this.filteredEmployees.length);
    },
    applyFilters: function() {
        const q = (document.querySelector('#emp-search')?.value||'').toLowerCase(), d = document.querySelector('#emp-dept-filter')?.value || 'All Departments';
        this.filteredEmployees = this.allEmployees.filter(e => (e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)) && (d === 'All Departments' || e.department === d));
        this.currentPage = 1; this.renderTable();
    },
    init: async function() {
        if (!document.querySelector('#employee-tbody')) return;
        try {
            const data = await API.get('/employees');
            this.allEmployees = data.map(e => ({ id: e.employee_id, name: e.name, avatar: DEFAULT_AVATAR, department: e.department, status: e.status === 'active' ? 'Active' : e.status === 'on_leave' ? 'On Leave' : 'Inactive', salary: parseFloat(e.salary), payrollStatus: e.payroll_status || 'Pending' }));
            this.filteredEmployees = [...this.allEmployees];
        } catch(err) { console.error('Error fetching employees:', err); }
        this.renderTable();
        document.querySelector('#emp-search')?.addEventListener('input', () => this.applyFilters());
        document.querySelector('#emp-dept-filter')?.addEventListener('change', () => this.applyFilters());
        document.querySelector('#emp-prev')?.addEventListener('click', () => { if (this.currentPage > 1) { this.currentPage--; this.renderTable(); } });
        document.querySelector('#emp-next')?.addEventListener('click', () => { if ((this.currentPage * this.PAGE_SIZE) < this.filteredEmployees.length) { this.currentPage++; this.renderTable(); } });
        document.querySelector('#btn-run-payroll')?.addEventListener('click', async () => { try { await API.post('/employees/payroll/run'); alert('Payroll run initiated!'); location.reload(); } catch(err) { console.error('Error running payroll:', err); } });
        document.querySelector('#btn-export-csv')?.addEventListener('click', () => {
            const rows = this.filteredEmployees.map(e => `${e.id},${e.name},${e.department},${e.status},${e.salary},${e.payrollStatus}`);
            const blob = new Blob(['ID,Name,Department,Status,Salary,Payroll Status\n' + rows.join('\n')], { type: 'text/csv' });
            const url = URL.createObjectURL(blob), a = Object.assign(document.createElement('a'), { href: url, download: 'employees.csv' });
            a.click(); URL.revokeObjectURL(url);
        });
    }
};

const AttendanceModule = {
    leaveRequests: [],
    renderTable: function() {
        const tbody = document.querySelector('#leave-tbody'); if (!tbody) return;
        tbody.innerHTML = this.leaveRequests.length ? this.leaveRequests.map(req => `
            <tr class="hover:bg-slate-50 transition-colors group" data-id="${req.id}">
                <td class="px-6 py-4"><div class="flex items-center gap-3"><img src="${req.avatar}" alt="${req.name}" class="w-9 h-9 rounded-full bg-slate-200 object-cover ring-2 ring-white shadow-sm"/><div><div class="font-semibold text-slate-800 text-sm">${req.name}</div><div class="text-xs text-slate-500 mt-0.5">${req.team}</div></div></div></td>
                <td class="px-6 py-4"><span class="px-2.5 py-1 ${req.leaveClass} rounded text-xs font-semibold border uppercase tracking-wide">${req.leaveType}</span></td>
                <td class="px-6 py-4"><div class="text-sm font-semibold text-slate-800">${req.duration}</div><div class="text-xs text-slate-500 mt-0.5">${req.range}</div></td>
                <td class="px-6 py-4 text-center"><div class="flex items-center justify-center gap-2"><button data-action="approve" data-id="${req.id}" class="p-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors focus:ring-2 focus:ring-emerald-500 outline-none" title="Approve"><span class="material-symbols-outlined text-[20px]">check</span></button><button data-action="reject" data-id="${req.id}" class="p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-md transition-colors focus:ring-2 focus:ring-rose-500 outline-none" title="Reject"><span class="material-symbols-outlined text-[20px]">close</span></button></div></td>
            </tr>`).join('') : `<tr><td colspan="4" class="text-center py-12 text-slate-400 text-sm">No pending requests.</td></tr>`;
    },
    init: async function() {
        if (!document.querySelector('#leave-tbody')) return;
        try {
            const data = await API.get('/attendance/leave-requests');
            this.leaveRequests = data.map(record => ({ id: record.id, name: record.name, team: record.team, avatar: DEFAULT_AVATAR, leaveType: record.type, leaveClass: 'bg-amber-50 text-amber-700 border-amber-100', duration: record.duration, range: record.range }));
        } catch(e) { console.error('Error fetching attendance:', e); }
        this.renderTable();
        document.querySelector('#leave-tbody')?.addEventListener('click', async e => {
            const btn = e.target.closest('[data-action]'); if (!btn) return;
            const { action, id } = btn.dataset;
            try { await API.put(`/attendance/leave-requests/${id}/${action}`); this.leaveRequests = this.leaveRequests.filter(r => r.id !== id); this.renderTable(); } catch (err) { console.error(err); }
        });
        document.querySelector('#btn-export-report')?.addEventListener('click', () => {
            const token = sessionStorage.getItem('cms_token') || localStorage.getItem('token') || '';
            globalThis.location.href = `http://localhost:5000/api/attendance/export?token=${token}`;
        });
    }
};

const TasksModule = {
    tasks: [], draggedId: null,
    renderCard: function(t) {
        if (t.status === 'completed') return `<div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grayscale-[0.3]" draggable="true" data-id="${t.id}"><div class="flex justify-between items-start mb-3"><span class="px-2.5 py-1 ${t.categoryClass} rounded text-[10px] font-bold uppercase tracking-wider border">${t.category}</span><span class="material-symbols-outlined text-[20px] text-emerald-500">check_circle</span></div><h4 class="font-bold text-slate-500 line-through text-sm leading-snug mb-3">${t.title}</h4><div class="flex items-center gap-2 text-slate-400 mt-2"><span class="text-[11px] font-medium tracking-wide text-emerald-600 font-semibold bg-emerald-50 px-2 rounded-full py-0.5 border border-emerald-100 uppercase">${t.completedLabel}</span></div></div>`;
        if (t.status === 'in-progress') return `<div class="bg-white p-4 rounded-xl shadow-card border-2 border-indigo-400 hover:shadow-floating transition-all cursor-grab relative overflow-hidden group" draggable="true" data-id="${t.id}"><div class="absolute inset-y-0 left-0 w-1.5 bg-indigo-500"></div><div class="pl-2"><div class="flex justify-between items-start mb-3"><span class="px-2.5 py-1 ${t.categoryClass} rounded text-[10px] font-bold uppercase tracking-wider border">${t.category}</span><span class="px-2 py-1 ${t.priorityClass} border border-rose-100 rounded text-[10px] font-bold">${t.priority}</span></div><h4 class="font-bold text-slate-800 text-sm leading-snug mb-3">${t.title}</h4><div class="w-full bg-slate-100 h-1.5 rounded-full mb-3 overflow-hidden"><div class="bg-indigo-500 h-full rounded-full" style="width:${t.progress}%"></div></div><div class="flex items-center justify-between mt-1"><div class="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold"><span class="material-symbols-outlined text-[14px]">sync</span> ${t.progress}% Checkpoint</div><img alt="Avatar" class="w-6 h-6 rounded-full ring-2 ring-white" src="${t.avatar}"/></div></div></div>`;
        if (t.status === 'review') return `<div class="bg-white p-4 rounded-xl shadow-card border border-slate-200 hover:shadow-floating transition-all cursor-grab group" draggable="true" data-id="${t.id}"><div class="flex justify-between items-start mb-3"><span class="px-2.5 py-1 ${t.categoryClass} rounded text-[10px] font-bold uppercase tracking-wider border">${t.category}</span><span class="px-2 py-1 ${t.priorityClass} rounded text-[10px] font-semibold">${t.priority}</span></div><h4 class="font-bold text-slate-800 text-sm leading-snug mb-3">${t.title}</h4><div class="flex items-center justify-between mt-4 border-t border-slate-100 pt-3"><div class="flex items-center gap-2 text-amber-500 font-semibold"><span class="material-symbols-outlined text-[16px]">visibility</span><span class="text-[11px]">${t.reviewLabel}</span></div><img alt="Avatar" class="w-6 h-6 rounded-full ring-2 ring-white" src="${t.avatar}"/></div></div>`;
        return `<div class="bg-white p-4 rounded-xl shadow-card border border-slate-200 hover:shadow-floating transition-all cursor-grab hover:border-indigo-300 group" draggable="true" data-id="${t.id}"><div class="flex justify-between items-start mb-3"><span class="px-2.5 py-1 ${t.categoryClass} rounded text-[10px] font-bold uppercase tracking-wider border">${t.category}</span><span class="px-2 py-1 ${t.priorityClass} rounded text-[10px] font-semibold">${t.priority}</span></div><h4 class="font-bold text-slate-800 text-sm leading-snug mb-3 group-hover:text-indigo-600 transition-colors">${t.title}</h4><div class="flex items-center justify-between mt-4">${t.dueIcon ? `<div class="flex items-center gap-2 text-slate-500"><span class="material-symbols-outlined text-[16px] text-amber-500">schedule</span><span class="text-xs font-medium">${t.dueLabel}</span></div>` : `<div class="flex items-center gap-1 text-slate-400"><span class="material-symbols-outlined text-[16px]">attach_file</span><span class="text-xs">${t.filesLabel}</span></div>`}<img alt="Avatar" class="w-6 h-6 rounded-full ring-2 ring-white" src="${t.avatar}"/></div></div>`;
    },
    renderBoard: function() {
        const columns = { 'todo': 'col-todo', 'in-progress': 'col-inprogress', 'review': 'col-review', 'completed': 'col-completed' };
        Object.entries(columns).forEach(([s, id]) => { const el = document.querySelector(`#${id}`); if (el) el.innerHTML = this.tasks.filter(t => t.status === s).map(t => this.renderCard(t)).join(''); });
    },
    init: async function() {
        if (!document.querySelector('#col-todo')) return;
        try {
            const data = await API.get('/tasks');
            this.tasks = data.map(t => ({ id: t.task_id.toString(), status: t.status === 'in_progress' ? 'in-progress' : t.status === 'done' ? 'completed' : t.status, category: 'Task', categoryClass: 'bg-indigo-50 text-indigo-700 border-indigo-100', priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1), priorityClass: t.priority === 'high' ? 'bg-rose-50 text-rose-700 border-rose-100' : t.priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600', title: t.title, dueLabel: t.deadline ? `Due: ${new Date(t.deadline).toLocaleDateString()}` : 'No deadline', dueIcon: true, progress: 50, reviewLabel: 'Ready for Review', completedLabel: 'Completed', avatar: DEFAULT_AVATAR }));
        } catch(e) { console.error('Error fetching tasks:', e); }
        this.renderBoard();

        document.addEventListener('dragstart', e => { const c = e.target.closest('[data-id]'); if (c) this.draggedId = c.dataset.id; });
        document.querySelectorAll('[data-column]').forEach(col => {
            col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('ring-2', 'ring-indigo-300'); });
            col.addEventListener('dragleave', () => col.classList.remove('ring-2', 'ring-indigo-300'));
            col.addEventListener('drop', async e => {
                e.preventDefault(); col.classList.remove('ring-2', 'ring-indigo-300');
                const newStatus = col.dataset.column, task = this.tasks.find(t => t.id === this.draggedId);
                if (task && task.status !== newStatus) {
                    const oldStatus = task.status; task.status = newStatus; this.renderBoard();
                    try { await API.put(`/tasks/${this.draggedId}/status`, { status: newStatus === 'in-progress' ? 'in_progress' : newStatus === 'completed' ? 'done' : newStatus }); } catch(err) { task.status = oldStatus; this.renderBoard(); console.error(err); }
                }
                this.draggedId = null;
            });
        });
        document.querySelector('#btn-new-task')?.addEventListener('click', () => alert('New Task modal — coming soon!'));
    }
};

const AnalyticsModule = {
    instances: {},
    renderPie: function(e) {
        const c = document.getElementById('deptChart'); if (!c) return;
        const d = e.reduce((acc, emp) => { acc[emp.department] = (acc[emp.department]||0)+1; return acc; }, {});
        if (this.instances.dept) this.instances.dept.destroy();
        this.instances.dept = new Chart(c, { type: 'pie', data: { labels: Object.keys(d), datasets: [{ data: Object.values(d), backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#3b82f6'], borderWidth: 0, hoverOffset: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } } });
    },
    renderDoughnut: function(tasks) {
        const c = document.getElementById('taskChart'); if (!c) return;
        const s = { todo: 0, in_progress: 0, review: 0, done: 0 };
        tasks.forEach(t => { if (s[t.status] !== undefined) s[t.status]++; });
        if (this.instances.task) this.instances.task.destroy();
        this.instances.task = new Chart(c, { type: 'doughnut', data: { labels: ['To Do', 'In Progress', 'Review', 'Done'], datasets: [{ data: [s.todo, s.in_progress, s.review, s.done], backgroundColor: ['#94a3b8', '#6366f1', '#f59e0b', '#10b981'], borderWidth: 0, hoverOffset: 4 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } } });
    },
    renderBar: function(a) {
        const c = document.getElementById('attendanceChart'); if (!c) return;
        const s = { Present: 0, Leave: 0, Late: 0, WFH: 0 };
        a.forEach(at => { if (s[at.status] !== undefined) s[at.status]++; });
        if (this.instances.att) this.instances.att.destroy();
        this.instances.att = new Chart(c, { type: 'bar', data: { labels: ['Present', 'Leave', 'Late', 'WFH'], datasets: [{ label: 'Records Count', data: [s.Present, s.Leave, s.Late, s.WFH], backgroundColor: ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6'], borderRadius: 4, borderSkipped: false }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } }, x: { grid: { display: false } } } } });
    },
    init: async function() {
        if (!document.getElementById('deptChart')) return;
        try {
            const [e, t, a] = await Promise.all([ API.get('/employees'), API.get('/tasks'), API.get('/attendance') ]);
            this.renderPie(e); this.renderDoughnut(t); this.renderBar(a);
        } catch(e) { console.error('Error loading analytics:', e); }
        document.querySelector('#report-form')?.addEventListener('submit', e => { e.preventDefault(); alert("Report generation workflow triggered!"); });
        document.querySelector('#btn-run-report')?.addEventListener('click', e => { e.preventDefault(); alert("Report generation workflow triggered!"); });
        document.querySelector('#btn-share')?.addEventListener('click', () => alert("Share intent captured."));
        document.querySelector('#btn-download-summary')?.addEventListener('click', () => alert("Summary PDF download will begin shortly."));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    EmployeeModule.init();
    AttendanceModule.init();
    TasksModule.init();
    AnalyticsModule.init();
});
