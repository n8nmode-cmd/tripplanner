import axios from 'axios';

// For Vercel: use relative paths (empty string means same domain)
// For local dev: use localhost:5001
const API_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance (no auth required)
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// TRIP SERVICES
export const tripService = {
    getAll: async () => {
        const response = await api.get('/api/trips');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/trips/${id}`);
        return response.data;
    },

    create: async (tripData) => {
        const response = await api.post('/api/trips', tripData);
        return response.data;
    },

    update: async (id, tripData) => {
        const response = await api.put(`/api/trips/${id}`, tripData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/trips/${id}`);
        return response.data;
    },
};

// EXPENSE SERVICES
export const expenseService = {
    getByTrip: async (tripId) => {
        const response = await api.get(`/api/expenses/trip/${tripId}`);
        return response.data;
    },

    create: async (expenseData) => {
        const response = await api.post('/api/expenses', expenseData);
        return response.data;
    },

    update: async (id, expenseData) => {
        const response = await api.put(`/api/expenses/${id}`, expenseData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/expenses/${id}`);
        return response.data;
    },

    getAnalytics: async (tripId) => {
        const response = await api.get(`/api/expenses/analytics/${tripId}`);
        return response.data;
    },
};

// CHECKLIST SERVICES
export const checklistService = {
    getByTrip: async (tripId) => {
        const response = await api.get(`/api/checklist/trip/${tripId}`);
        return response.data;
    },

    create: async (checklistData) => {
        const response = await api.post('/api/checklist', checklistData);
        return response.data;
    },

    update: async (id, checklistData) => {
        const response = await api.put(`/api/checklist/${id}`, checklistData);
        return response.data;
    },

    toggle: async (id) => {
        const response = await api.put(`/api/checklist/${id}/toggle`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/checklist/${id}`);
        return response.data;
    },

    applyTemplate: async (tripId, templateType) => {
        const response = await api.post(`/api/checklist/template/${tripId}`, { templateType });
        return response.data;
    },

    getStats: async (tripId) => {
        const response = await api.get(`/api/checklist/stats/${tripId}`);
        return response.data;
    },
};

export default api;
