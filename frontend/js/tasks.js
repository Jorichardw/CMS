/**
 * tasks.js — CMS PORTAL - Mini Project Task Board (Kanban) Module
 *
 * Handles:
 *  - Rendering task cards into Kanban columns
 *  - New Task button (placeholder modal trigger)
 *  - Drag-and-drop between columns (HTML5 native DnD)
 *
 * Data source: tasksAPI (api.js) — falls back to static mock data.
 */

'use strict';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_TASKS = [
    {
        id: 'T-001', status: 'todo',
        category: 'Research', categoryClass: 'bg-rose-50 text-rose-700 border-rose-100',
        priority: 'Medium', priorityClass: 'bg-amber-50 text-amber-700',
        title: 'Competitor Analysis for Q3 Product Update',
        dueLabel: 'Due in 3 days', dueIcon: true,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwxbV2kKu56lH9G67wsOTXe1K867tEJxavBvU0375_YBMbH_wIj8mjb3zbO0UKwM6wzl-tlCt5JZqi3fAbTKJI5iAVfZm9IRXflmCAmtWK843uWCx-YasRwvSjqvn0Z3VDozr4v00xQSaOIZXrQ-2zxTFw5KHKuYe1a_5qqNTLme0cQzjJT0KplOaNOmpkBRA4x1t7WSwKnNlcLJcrIE1Fa9uvtWk5ar1DYug-QCmGqSmk6RUGk8Et7rZ8RV5MpWLMTgFucxB9ZgI',
    },
    {
        id: 'T-002', status: 'todo',
        category: 'Design', categoryClass: 'bg-purple-50 text-purple-700 border-purple-100',
        priority: 'Low', priorityClass: 'bg-slate-100 text-slate-600',
        title: 'Update Brand Guidelines',
        filesLabel: '4 Files',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYWlPwAsXa_a_J6vMfDfIPLiypSfWghjjMcaqcO_7vOGKTaTDNJuTz3j5Ibb9HZt109UkSd7JoaI8txVLdxlCT0wM2lFMNGbTLPeA6sTJxgxunHXFS4c-AAZ9zLPvSfqrPE-t9fn2Ms-HLl-GOqgkwnbfdRgzZvyGaC8FkgY4oWct0j_zIxrjhMgiwN1lMTKysCmSO2Ac-6t_pq8JfmqDK_MF72nyReAuvY-vyaJakUwdoVS_ZLX1FntpEuPTj0R5zsiGErnJF6dY',
    },
    {
        id: 'T-003', status: 'in-progress',
        category: 'Development', categoryClass: 'bg-blue-50 text-blue-700 border-blue-100',
        priority: 'Urgent', priorityClass: 'bg-rose-50 text-rose-700 border-rose-100',
        title: 'Fix Payload Bottleneck in Operations Module',
        progress: 45,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlfxR8DcH7Va0wy6YmuUkjRm6Z1vfMAaajOKQX_PP48uR6uM3rbDzIC8fTWwWIpWw34LFK8HkCOsJnqGh4rO4fipHRcpe_7x7q68muopeApVl_dz23dX_Agdl3p1VArqeKxZvJXGTLJf4FDbHV1_yFoOhgx5RKecRKWWLNuaF0eqXpI3v3CVL8TOpKHS1risYgGUW3oq26fnlsMR2DXY-1am2GlRZOl2yWtfh3pew__Y32trOB76rlma3d6N9UiATq1BBcgea2a54',
    },
    {
        id: 'T-004', status: 'review',
        category: 'DevOps', categoryClass: 'bg-green-50 text-green-700 border-green-100',
        priority: 'High', priorityClass: 'bg-slate-100 text-slate-600',
        title: 'Database Migration (AWS Region Shift)',
        reviewLabel: 'Ready for Review',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtezuRqltfG6p7q1n2VARAl61AutUYh9kbAqUofIZuJUfH-Iu8-ncItEboRN99mEp_IKi5cjJJoO_i3gggQ0jMxdoKQduNrEbd_wdd3IFyPKd9L9JsJGy_oGmHKlYTcCh-KCCM9P70Mu47XX_mibzqGfI1jg7lm0ofCa5l1CB6TOGBcrQPlZhnfYTjbsmh5dWFvm05VAir_jv88AWX2RyIWngb4GWr1h0VZoL-I56jWCGt5-kvIdsiMxvwCSD53XslQi6mUZhn3KU',
    },
    {
        id: 'T-005', status: 'completed',
        category: 'Marketing', categoryClass: 'bg-slate-100 text-slate-600 border-slate-200',
        title: 'Finalize Vendor Agreements',
        completedLabel: 'Completed yesterday',
    },
];

// ── State ─────────────────────────────────────────────────────────────────────

let tasks = [...MOCK_TASKS];
let draggedId = null;

// ── Render Helpers ────────────────────────────────────────────────────────────

function renderTaskCard(task) {
    if (task.status === 'completed') {
        return `
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grayscale-[0.3]" draggable="true" data-id="${task.id}">
            <div class="flex justify-between items-start mb-3">
                <span class="px-2.5 py-1 ${task.categoryClass} rounded text-[10px] font-bold uppercase tracking-wider border">${task.category}</span>
                <span class="material-symbols-outlined text-[20px] text-emerald-500">check_circle</span>
            </div>
            <h4 class="font-bold text-slate-500 line-through text-sm leading-snug mb-3">${task.title}</h4>
            <div class="flex items-center gap-2 text-slate-400 mt-2">
                <span class="text-[11px] font-medium tracking-wide text-emerald-600 font-semibold bg-emerald-50 px-2 rounded-full py-0.5 border border-emerald-100 uppercase">${task.completedLabel}</span>
            </div>
        </div>`;
    }

    if (task.status === 'in-progress') {
        return `
        <div class="bg-white p-4 rounded-xl shadow-card border-2 border-indigo-400 hover:shadow-floating transition-all cursor-grab relative overflow-hidden group" draggable="true" data-id="${task.id}">
            <div class="absolute inset-y-0 left-0 w-1.5 bg-indigo-500"></div>
            <div class="pl-2">
                <div class="flex justify-between items-start mb-3">
                    <span class="px-2.5 py-1 ${task.categoryClass} rounded text-[10px] font-bold uppercase tracking-wider border">${task.category}</span>
                    <span class="px-2 py-1 ${task.priorityClass} border border-rose-100 rounded text-[10px] font-bold">${task.priority}</span>
                </div>
                <h4 class="font-bold text-slate-800 text-sm leading-snug mb-3">${task.title}</h4>
                <div class="w-full bg-slate-100 h-1.5 rounded-full mb-3 overflow-hidden">
                    <div class="bg-indigo-500 h-full rounded-full" style="width:${task.progress}%"></div>
                </div>
                <div class="flex items-center justify-between mt-1">
                    <div class="flex items-center gap-1.5 text-indigo-600 text-xs font-semibold">
                        <span class="material-symbols-outlined text-[14px]">sync</span> ${task.progress}% Checkpoint
                    </div>
                    <img alt="Avatar" class="w-6 h-6 rounded-full ring-2 ring-white" src="${task.avatar}"/>
                </div>
            </div>
        </div>`;
    }

    if (task.status === 'review') {
        return `
        <div class="bg-white p-4 rounded-xl shadow-card border border-slate-200 hover:shadow-floating transition-all cursor-grab group" draggable="true" data-id="${task.id}">
            <div class="flex justify-between items-start mb-3">
                <span class="px-2.5 py-1 ${task.categoryClass} rounded text-[10px] font-bold uppercase tracking-wider border">${task.category}</span>
                <span class="px-2 py-1 ${task.priorityClass} rounded text-[10px] font-semibold">${task.priority}</span>
            </div>
            <h4 class="font-bold text-slate-800 text-sm leading-snug mb-3">${task.title}</h4>
            <div class="flex items-center justify-between mt-4 border-t border-slate-100 pt-3">
                <div class="flex items-center gap-2 text-amber-500 font-semibold">
                    <span class="material-symbols-outlined text-[16px]">visibility</span>
                    <span class="text-[11px]">${task.reviewLabel}</span>
                </div>
                <img alt="Avatar" class="w-6 h-6 rounded-full ring-2 ring-white" src="${task.avatar}"/>
            </div>
        </div>`;
    }

    // Default: 'todo'
    const meta = task.dueIcon
        ? `<div class="flex items-center gap-2 text-slate-500"><span class="material-symbols-outlined text-[16px] text-amber-500">schedule</span><span class="text-xs font-medium">${task.dueLabel}</span></div>`
        : `<div class="flex items-center gap-1 text-slate-400"><span class="material-symbols-outlined text-[16px]">attach_file</span><span class="text-xs">${task.filesLabel}</span></div>`;

    return `
    <div class="bg-white p-4 rounded-xl shadow-card border border-slate-200 hover:shadow-floating transition-all cursor-grab hover:border-indigo-300 group" draggable="true" data-id="${task.id}">
        <div class="flex justify-between items-start mb-3">
            <span class="px-2.5 py-1 ${task.categoryClass} rounded text-[10px] font-bold uppercase tracking-wider border">${task.category}</span>
            <span class="px-2 py-1 ${task.priorityClass} rounded text-[10px] font-semibold">${task.priority}</span>
        </div>
        <h4 class="font-bold text-slate-800 text-sm leading-snug mb-3 group-hover:text-indigo-600 transition-colors">${task.title}</h4>
        <div class="flex items-center justify-between mt-4">
            ${meta}
            <img alt="Avatar" class="w-6 h-6 rounded-full ring-2 ring-white" src="${task.avatar}"/>
        </div>
    </div>`;
}

// ── Drag & Drop ───────────────────────────────────────────────────────────────

function setupDragAndDrop() {
    document.addEventListener('dragstart', e => {
        const card = e.target.closest('[data-id]');
        if (card) draggedId = card.dataset.id;
    });

    document.querySelectorAll('[data-column]').forEach(col => {
        col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('ring-2', 'ring-indigo-300'); });
        col.addEventListener('dragleave', () => col.classList.remove('ring-2', 'ring-indigo-300'));
        col.addEventListener('drop', e => {
            e.preventDefault();
            col.classList.remove('ring-2', 'ring-indigo-300');
            const newStatus = col.dataset.column;
            const task = tasks.find(t => t.id === draggedId);
            if (task && task.status !== newStatus) {
                task.status = newStatus;
                // TODO: tasksAPI.move(draggedId, newStatus)
                renderBoard();
            }
            draggedId = null;
        });
    });
}

function renderBoard() {
    const columns = { 'todo': 'col-todo', 'in-progress': 'col-inprogress', 'review': 'col-review', 'completed': 'col-completed' };
    Object.entries(columns).forEach(([status, colId]) => {
        const el = document.querySelector(`#${colId}`);
        if (!el) return;
        const col = tasks.filter(t => t.status === status);
        el.innerHTML = col.map(renderTaskCard).join('');
    });
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const token = sessionStorage.getItem('cms_token') || localStorage.getItem('token') || '';
        const response = await fetch('http://localhost:5000/api/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Map DB fields to UI fields
            tasks = data.map(t => {
                let statusMap = t.status;
                if (t.status === 'in_progress') statusMap = 'in-progress';
                if (t.status === 'done') statusMap = 'completed';

                let priorityClass = 'bg-slate-100 text-slate-600';
                if (t.priority === 'high') priorityClass = 'bg-rose-50 text-rose-700 border-rose-100';
                if (t.priority === 'medium') priorityClass = 'bg-amber-50 text-amber-700';

                return {
                    id: t.task_id.toString(),
                    status: statusMap,
                    category: 'Task', 
                    categoryClass: 'bg-indigo-50 text-indigo-700 border-indigo-100',
                    priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
                    priorityClass: priorityClass,
                    title: t.title,
                    dueLabel: t.deadline ? `Due: ${new Date(t.deadline).toLocaleDateString()}` : 'No deadline',
                    dueIcon: true,
                    progress: 50,
                    reviewLabel: 'Ready for Review',
                    completedLabel: 'Completed',
                    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwxbV2kKu56lH9G67wsOTXe1K867tEJxavBvU0375_YBMbH_wIj8mjb3zbO0UKwM6wzl-tlCt5JZqi3fAbTKJI5iAVfZm9IRXflmCAmtWK843uWCx-YasRwvSjqvn0Z3VDozr4v00xQSaOIZXrQ-2zxTFw5KHKuYe1a_5qqNTLme0cQzjJT0KplOaNOmpkBRA4x1t7WSwKnNlcLJcrIE1Fa9uvtWk5ar1DYug-QCmGqSmk6RUGk8Et7rZ8RV5MpWLMTgFucxB9ZgI'
                };
            });
        } else {
            console.error('Failed to fetch tasks. Status:', response.status);
        }
    } catch (err) {
        console.error('Error fetching tasks:', err);
    }

    renderBoard();
    setupDragAndDrop();

    document.querySelector('#btn-new-task')?.addEventListener('click', () => {
        // TODO: open Add Task modal
        alert('New Task modal — coming soon!');
    });
});
