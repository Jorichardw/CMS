/**
 * analytics.js — CMS Portal Analytics & Reports Module
 *
 * Handles:
 *  - Custom Report Generator form submission
 *  - Share and Download Summary button actions
 *  - Chart data wiring (CSS-based charts remain; hook for Chart.js upgrade)
 *
 * Data source: analyticsAPI (api.js) — falls back to static mock data.
 */

'use strict';

// ── Mock KPI Data (used until backend is connected) ───────────────────────────

const MOCK_FINANCIAL = [
    { month: 'Jan', revenue: 40000, costs: 20000 },
    { month: 'Feb', revenue: 50000, costs: 25000 },
    { month: 'Mar', revenue: 60000, costs: 18000 },
    { month: 'Apr', revenue: 55000, costs: 30000 },
    { month: 'May', revenue: 75000, costs: 20000 },
];

const MOCK_EXPENDITURE = [
    { label: 'Engineering', pct: 42, color: 'indigo' },
    { label: 'Marketing', pct: 28, color: 'emerald' },
    { label: 'Operations', pct: 18, color: 'amber' },
    { label: 'Others', pct: 12, color: 'slate' },
];

// ── Report Generator ──────────────────────────────────────────────────────────

async function handleRunReport(e) {
    e.preventDefault();

    const module = document.querySelector('#report-module')?.value || 'All Operations';
    const dateRange = document.querySelector('#report-date-range')?.value || 'Q1';
    const format = document.querySelector('#report-format')?.value || 'PDF Document';

    console.log('[Analytics] Running report:', { module, dateRange, format });

    // Visual feedback
    const btn = document.querySelector('#btn-run-report');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Generating…';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '<span class="material-symbols-outlined text-[20px]">play_circle</span> Run Report';
            alert(`Report generated!\nModule: ${module}\nPeriod: ${dateRange}\nFormat: ${format}\n\n(Backend integration pending)`);
        }, 1200);
    }

    // TODO: analyticsAPI.runReport({ module, dateRange, format })
}

function handleShare() {
    if (navigator.share) {
        navigator.share({ title: 'CMS Analytics', url: window.location.href });
    } else {
        navigator.clipboard.writeText(window.location.href)
            .then(() => alert('Analytics page URL copied to clipboard!'));
    }
}

function handleDownloadSummary() {
    // TODO: analyticsAPI.downloadReport('pdf')
    alert('Downloading PDF summary… (Backend integration pending)');
}

// ── Chart Data Update ─────────────────────────────────────────────────────────

/**
 * Stub: update CSS bar chart heights from data.
 * Replace with Chart.js or similar for production.
 */
function updateFinancialChart(data) {
    const maxRev = Math.max(...data.map(d => d.revenue));
    const bars = document.querySelectorAll('[data-chart-col]');

    bars.forEach((bar, i) => {
        if (!data[i]) return;
        const revPct = Math.round((data[i].revenue / maxRev) * 100);
        const costPct = Math.round((data[i].costs / maxRev) * 100);
        bar.querySelector('[data-rev-bar]')?.style.setProperty('height', `${revPct}%`);
        bar.querySelector('[data-cost-bar]')?.style.setProperty('height', `${costPct}%`);
    });
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#report-form')?.addEventListener('submit', handleRunReport);
    document.querySelector('#btn-run-report')?.addEventListener('click', handleRunReport);
    document.querySelector('#btn-share')?.addEventListener('click', handleShare);
    document.querySelector('#btn-download-summary')?.addEventListener('click', handleDownloadSummary);

    // Optionally wire live data to chart
    // updateFinancialChart(MOCK_FINANCIAL);
});
