import axios from 'axios';

// Create Axios instance with cookie credentials enabled for cross-origin JWT session handling
const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Authentication endpoints
export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post('/auth/logout');
  return response.data;
};

// Music & Album endpoints
export const fetchAllMusic = async () => {
  const response = await API.get('/music');
  return response.data;
};

export const fetchAllAlbums = async () => {
  const response = await API.get('/music/albums');
  return response.data;
};

export const fetchAlbumById = async (albumId) => {
  const response = await API.get(`/music/albums/${albumId}`);
  return response.data;
};

export const uploadMusicTrack = async (formData) => {
  const response = await API.post('/music/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createAlbum = async (albumData) => {
  const response = await API.post('/music/album', albumData);
  return response.data;
};

export default API;
