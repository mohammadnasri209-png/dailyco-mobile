// src/api/client.js — thin axios wrapper. Reads the backend URL from
// app.json > expo.extra.apiBaseUrl so it's a one-line change to point the
// whole app at your justrunmy deployment.
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

const TOKEN_KEY = 'dailyco_token';
const ADMIN_TOKEN_KEY = 'dailyco_admin_original_token';

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function saveToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}
export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

// --- Used only during admin impersonation: keep the admin's own token
// stashed so they can switch back without logging in again. ---------------
export async function saveAdminOriginalToken(token) {
  await SecureStore.setItemAsync(ADMIN_TOKEN_KEY, token);
}
export async function getAdminOriginalToken() {
  try { return await SecureStore.getItemAsync(ADMIN_TOKEN_KEY); } catch (e) { return null; }
}
export async function clearAdminOriginalToken() {
  await SecureStore.deleteItemAsync(ADMIN_TOKEN_KEY);
}

// --- API calls, grouped by feature ----------------------------------------
export const AuthAPI = {
  signup: (name, email, password) =>
    api.post('/api/auth/signup', { name, email, password }).then(r => r.data),
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }).then(r => r.data),
  me: () => api.get('/api/auth/me').then(r => r.data),
  forgotPassword: (email) =>
    api.post('/api/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (email, token, newPassword) =>
    api.post('/api/auth/reset-password', { email, token, newPassword }).then(r => r.data),
};

export const ContentAPI = {
  all: () => api.get('/api/content').then(r => r.data.content),
};

export const SupportAPI = {
  contactNote: () => api.get('/api/support/content').then(r => r.data.contact_note),
  createTicket: (subject, message) =>
    api.post('/api/support/tickets', { subject, message }).then(r => r.data),
  myTickets: () => api.get('/api/support/tickets').then(r => r.data.tickets),
};

export const AdminAPI = {
  listUsers: (q) => api.get('/api/admin/users', { params: { q } }).then(r => r.data.users),
  setRole: (userId, role) => api.put(`/api/admin/users/${userId}/role`, { role }).then(r => r.data),
  impersonate: (userId, accessCode) =>
    api.post('/api/admin/impersonate', { userId, accessCode }).then(r => r.data),
  getContent: () => api.get('/api/admin/content').then(r => r.data.content),
  setContent: (key, value) => api.put(`/api/admin/content/${key}`, { value }).then(r => r.data),
  listTickets: (status) => api.get('/api/admin/support/tickets', { params: { status } }).then(r => r.data.tickets),
  replyTicket: (id, admin_reply, status) =>
    api.put(`/api/admin/support/tickets/${id}`, { admin_reply, status }).then(r => r.data),
};

export const TeacherAPI = {
  listStudents: () => api.get('/api/teacher/students').then(r => r.data.students),
  studentDetail: (id) => api.get(`/api/teacher/students/${id}`).then(r => r.data),
};

export const AppAPI = {
  profile: () => api.get('/api/app/profile').then(r => r.data),
  lessonToday: () => api.get('/api/app/lesson/today').then(r => r.data),
  reviewDue: () => api.get('/api/app/review/due').then(r => r.data),
  submitReview: (word, quality) =>
    api.post('/api/app/review/answer', { word, quality }).then(r => r.data),
  levelTestQuestions: () => api.get('/api/app/level-test/questions').then(r => r.data),
  submitLevelTest: (answers) =>
    api.post('/api/app/level-test/submit', { answers }).then(r => r.data),
  leaderboard: () => api.get('/api/app/leaderboard').then(r => r.data),
  wordMatchStart: () => api.get('/api/app/games/word-match').then(r => r.data),
  wordMatchAnswer: (word, chosen) =>
    api.post('/api/app/games/word-match/answer', { word, chosen }).then(r => r.data),
  scrambleStart: () => api.get('/api/app/games/sentence-scramble').then(r => r.data),
  scrambleAnswer: (words) =>
    api.post('/api/app/games/sentence-scramble/answer', { words }).then(r => r.data),
};
