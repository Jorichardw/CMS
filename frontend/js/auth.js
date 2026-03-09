/**
 * auth.js — CMS PORTAL - Mini Project Authentication & Sidebar Utilities
 *
 * Handles:
 *  - Sidebar toggle (mobile hamburger menu)
 *  - Active nav link highlighting based on current page
 *  - Session / login state stub (ready for backend integration)
 */

'use strict';

// ── Sidebar Toggle ────────────────────────────────────────────────────────────

/**
 * Toggles the sidebar's off-canvas visibility on mobile.
 * Replaces inline onclick="document.getElementById('sidebar').classList.toggle(...)"
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('-translate-x-full');
    }
}

// ── Active Nav Link ──────────────────────────────────────────────────────────

/**
 * Automatically highlights the correct sidebar nav link
 * based on the current page filename.
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('aside nav a');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        const isActive = linkPage === currentPage;

        // Active state
        link.classList.toggle('bg-indigo-600', isActive);
        link.classList.toggle('text-white', isActive);
        link.classList.toggle('shadow-md', isActive);
        link.classList.toggle('shadow-indigo-900/20', isActive);

        // Inactive state
        link.classList.toggle('text-slate-400', !isActive);
        link.classList.toggle('hover:text-slate-100', !isActive);
        link.classList.toggle('hover:bg-slate-800', !isActive);
    });
}

// ── Session Stub ──────────────────────────────────────────────────────────────

/**
 * Returns the currently logged-in user from sessionStorage.
 * Replace with a real API call (api.js → /api/auth/me) when backend is ready.
 */
function getCurrentUser() {
    const stored = sessionStorage.getItem('cms_user');
    if (stored) return JSON.parse(stored);

    // Default admin for demo
    return { name: 'Bala', role: 'System Admin' };
}

/**
 * Injects the current user's name into the sidebar profile area.
 */
function renderUserProfile() {
    const nameEl = document.querySelector('#sidebar-user-name');
    const roleEl = document.querySelector('#sidebar-user-role');
    const user = getCurrentUser();

    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role;
}

// ── DOMContentLoaded Bootstrap ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    renderUserProfile();

    // Wire up mobile menu buttons via JS instead of inline onclick
    document.querySelectorAll('[data-sidebar-toggle]').forEach(btn => {
        btn.addEventListener('click', toggleSidebar);
    });
});
