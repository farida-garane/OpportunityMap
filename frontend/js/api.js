/**
 * api.js — Core API layer for OpportuniMap
 * Handles all requests to the Node.js/Express backend and manages JWT tokens.
 */

const API_BASE_URL = 'https://opportunitymap-backend.onrender.com/api';

// --- AUTH & TOKEN MANAGEMENT ---

function setToken(token) {
  localStorage.setItem('opportunimap_token', token);
}

function getToken() {
  return localStorage.getItem('opportunimap_token');
}

function removeToken() {
  localStorage.removeItem('opportunimap_token');
}

function isAuthenticated() {
  return !!getToken();
}

// --- FETCH WRAPPER ---
/**
 * Generic fetch function that automatically adds the Authorization header if a token exists.
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue avec le serveur.');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

// --- API METHODS ---

const api = {
  // Authentication
  auth: {
    async register(userData) {
      return fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },
    async login(email, password) {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.token) {
        setToken(data.token);
      }
      return data;
    },
    async getProfile() {
      return fetchAPI('/auth/profile');
    },
    logout() {
      removeToken();
      window.location.href = 'index.html';
    }
  },

  // Opportunities
  opportunities: {
    async getAll(filters = {}) {
      // Build query string from filters object
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.field) params.append('field', filters.field);
      if (filters.city) params.append('city', filters.city);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      return fetchAPI(`/opportunities${queryString}`);
    },
    async getById(id) {
      return fetchAPI(`/opportunities/${id}`);
    },
    async create(opportunityData) {
      return fetchAPI('/opportunities', {
        method: 'POST',
        body: JSON.stringify(opportunityData)
      });
    }
  },

  // Favorites
  favorites: {
    async getAll() {
      return fetchAPI('/favorites');
    },
    async add(opportunityId) {
      return fetchAPI(`/favorites/${opportunityId}`, { method: 'POST' });
    },
    async remove(opportunityId) {
      return fetchAPI(`/favorites/${opportunityId}`, { method: 'DELETE' });
    }
  },

  // Dashboard
  dashboard: {
    async getSummary() {
      return fetchAPI('/dashboard');
    }
  },

  // Notifications
  notifications: {
    async getAll() {
      return fetchAPI('/notifications');
    },
    async markAsRead(id) {
      return fetchAPI(`/notifications/${id}/read`, { method: 'PUT' });
    }
  }
};

// Export to window object for global access
window.api = api;
window.isAuthenticated = isAuthenticated;
