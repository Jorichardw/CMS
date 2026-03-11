const UI = {
    renderSidebar: function() {
        const user = JSON.parse(sessionStorage.getItem('cms_user') || '{"name":"Bala","role":"System Admin"}');
        
        return `
        <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20 flex-shrink-0 transition-transform duration-300 absolute inset-y-0 left-0 lg:static lg:translate-x-0 -translate-x-full" id="sidebar">
            <div class="h-16 flex items-center px-6 border-b border-slate-800">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <span class="material-symbols-outlined text-[20px]">corporate_fare</span>
                    </div>
                    <div><h1 class="font-bold text-white text-base leading-tight">CMS PORTAL</h1></div>
                </div>
                <button class="lg:hidden ml-auto text-slate-400 hover:text-white" data-sidebar-toggle>
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
                <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">Main Menu</div>
                <nav class="space-y-1" id="nav-menu">
                    ${[
                        { href: 'index.html', icon: 'dashboard', label: 'Dashboard' },
                        { href: 'employees.html', icon: 'group', label: 'Employee List' },
                        { href: 'attendance.html', icon: 'event_available', label: 'Attendance' },
                        { href: 'tasks.html', icon: 'view_kanban', label: 'Task Board' },
                        { href: 'analytics.html', icon: 'analytics', label: 'Analytics' }
                    ].map(link => `
                        <a href="${link.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all nav-link">
                            <span class="material-symbols-outlined text-[20px]">${link.icon}</span> ${link.label}
                        </a>
                    `).join('')}
                </nav>
            </div>
            <div class="p-4 border-t border-slate-800">
                <div class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                    <img alt="Admin Avatar" class="w-9 h-9 rounded-full ring-2 ring-slate-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwxbV2kKu56lH9G67wsOTXe1K867tEJxavBvU0375_YBMbH_wIj8mjb3zbO0UKwM6wzl-tlCt5JZqi3fAbTKJI5iAVfZm9IRXflmCAmtWK843uWCx-YasRwvSjqvn0Z3VDozr4v00xQSaOIZXrQ-2zxTFw5KHKuYe1a_5qqNTLme0cQzjJT0KplOaNOmpkBRA4x1t7WSwKnNlcLJcrIE1Fa9uvtWk5ar1DYug-QCmGqSmk6RUGk8Et7rZ8RV5MpWLMTgFucxB9ZgI" />
                    <div class="overflow-hidden">
                        <p class="text-sm font-medium text-white truncate" id="sidebar-user-name">${user.name}</p>
                        <p class="text-[10px] text-slate-400 truncate uppercase tracking-wider mt-0.5" id="sidebar-user-role">${user.role}</p>
                    </div>
                </div>
            </div>
        </aside>`;
    },

    renderHeader: function(title) {
        return `
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 flex-shrink-0 shadow-sm shadow-slate-200/50">
            <div class="flex items-center gap-4">
                <button class="lg:hidden text-slate-500 hover:text-slate-800" data-sidebar-toggle>
                    <span class="material-symbols-outlined">menu</span>
                </button>
                <h2 class="text-lg font-bold text-slate-800 hidden sm:block">${title}</h2>
            </div>
            <div class="flex items-center gap-4">
                <div class="relative hidden py-1 md:block">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
                    <input type="text" placeholder="Search..." class="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 transition-all">
                </div>
                <button class="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 focus:ring-2 focus:ring-indigo-500">
                    <span class="material-symbols-outlined">notifications</span>
                    <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                </button>
            </div>
        </header>`;
    },

    init: function(title) {
        // Inject Layout components
        const sidebarContainer = document.getElementById('sidebar-container');
        const headerContainer = document.getElementById('header-container');
        if (sidebarContainer) sidebarContainer.outerHTML = this.renderSidebar();
        if (headerContainer) headerContainer.outerHTML = this.renderHeader(title);

        // Active Link Logic
        const currentPage = globalThis.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const isActive = link.getAttribute('href') === currentPage;
            let activeClasses = ['bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-900/20'];
            let inactiveClasses = ['text-slate-400', 'hover:text-slate-100', 'hover:bg-slate-800'];
            
            if (isActive) {
                link.classList.add(...activeClasses);
                link.classList.remove(...inactiveClasses);
            } else {
                link.classList.add(...inactiveClasses);
                link.classList.remove(...activeClasses);
            }
        });

        // Event Delegation for layout interactions (Sidebar Toggle)
        document.addEventListener('click', e => {
            if (e.target.closest('[data-sidebar-toggle]')) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) sidebar.classList.toggle('-translate-x-full');
            }
        });
    }
};
