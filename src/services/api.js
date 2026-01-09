import axios from 'axios';
import { supabase } from '../config/supabase';

// Use localhost for local dev, relative path will be used in production Vercel
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
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
