const API_BASE = 'http://localhost:5000/api';

const API = {
    request: async function(endpoint, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        const token = sessionStorage.getItem('cms_token') || localStorage.getItem('token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
            if (!res.ok) throw new Error(`HTTP ${res.status} - ${await res.text()}`);
            if (res.status === 204) return null;
            return res.json();
        } catch (err) {
            console.error(`[API] ${options.method || 'GET'} ${endpoint} error:`, err);
            throw err;
        }
    },
    get: function(endpoint) { return this.request(endpoint, { method: 'GET' }); },
    post: function(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    put: function(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    delete: function(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
};

window.API = API;
