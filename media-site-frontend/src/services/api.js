import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken
        });
        
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth service functions
export const authService = {
  // Login and get tokens
  login: async (credentials) => {
    try {
      const response = await api.post('/api/token/', credentials);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      console.log('Tokens stored successfully');
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Get stored tokens
  getTokens: () => {
    return {
      access: localStorage.getItem('access_token'),
      refresh: localStorage.getItem('refresh_token')
    };
  }
};

// Blog service functions
export const blogService = {
  // Get all blog posts
  getAllPosts: async () => {
    try {
      const response = await api.get('/api/blog/');
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Get single blog post by ID
  getPostById: async (id) => {
    try {
      const response = await api.get(`/api/blog/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  // Create new blog post (requires auth)
  createPost: async (postData) => {
    try {
      const config = postData instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      
      const response = await api.post('/api/blog/', postData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  // Update blog post (requires auth)
  updatePost: async (id, postData) => {
    try {
      const config = postData instanceof FormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      
      const response = await api.put(`/api/blog/${id}/`, postData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  // Delete blog post (requires auth)
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/api/blog/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }
};

export const audioService = {
  // Get all audio files
  getAllAudio: async () => {
    try {
      const response = await api.get('/api/audio/');
      return response.data;
    } catch (error) {
      console.error('Error fetching audio files:', error);
      throw error;
    }
  },

  // Get single audio file by ID
  getAudioById: async (id) => {
    try {
      const response = await api.get(`/api/audio/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching audio file:', error);
      throw error;
    }
  },

  // Upload audio file (requires auth)
  uploadAudio: async (audioData) => {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const response = await api.post('/api/audio/', audioData, config);
      return response.data;
    } catch (error) {
      console.error('Error uploading audio file:', error);
      throw error;
    }
  },

  // Update audio file (requires auth)
  updateAudio: async (id, audioData) => {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const response = await api.put(`/api/audio/${id}/`, audioData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating audio file:', error);
      throw error;
    }
  },

  // Delete audio file (requires auth)
  deleteAudio: async (id) => {
    try {
      const response = await api.delete(`/api/audio/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting audio file:', error);
      throw error;
    }
  }
};

export const videoService = {
  // Get all video files
  getAllVideos: async () => {
    try {
      const response = await api.get('/api/video/');
      return response.data;
    } catch (error) {
      console.error('Error fetching video files:', error);
      throw error;
    }
  },

  // Get single video file by ID
  getVideoById: async (id) => {
    try {
      const response = await api.get(`/api/video/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching video file:', error);
      throw error;
    }
  },

  // Upload video file (requires auth)
  uploadVideo: async (videoData) => {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const response = await api.post('/api/video/', videoData, config);
      return response.data;
    } catch (error) {
      console.error('Error uploading video file:', error);
      throw error;
    }
  },

  // Update video file (requires auth)
  updateVideo: async (id, videoData) => {
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const response = await api.put(`/api/video/${id}/`, videoData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating video file:', error);
      throw error;
    }
  },

  // Delete video file (requires auth)
  deleteVideo: async (id) => {
    try {
      const response = await api.delete(`/api/video/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting video file:', error);
      throw error;
    }
  }
};

// Utility function to get full media URL
export const getMediaUrl = (filePath) => {
  if (!filePath) return '';
  return filePath.startsWith('http') ? filePath : `${API_BASE_URL}${filePath}`;
};

export default api;