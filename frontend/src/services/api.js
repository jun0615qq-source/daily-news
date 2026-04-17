import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE.endsWith('/api') ? BASE : `${BASE}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── 요청 인터셉터 (Firebase 토큰 자동 첨부) ────────────────────────────────────
api.interceptors.request.use(async config => {
  try {
    const { auth } = await import('../firebase');
    if (auth?.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

// ── 응답 인터셉터 (공통 에러 처리) ────────────────────────────────────────────
api.interceptors.response.use(
  res => res.data,
  err => {
    const msg = err.response?.data?.error || err.message || '네트워크 오류가 발생했습니다.';
    return Promise.reject(new Error(msg));
  }
);

// ── 뉴스 API ──────────────────────────────────────────────────────────────────
export const newsApi = {
  getCategories: ()           => api.get('/news/categories'),
  getNews:       (params = {}) => api.get('/news', { params }),
  incrementView: (id)          => api.post(`/news/${id}/view`).catch(() => {}), // 실패해도 무시
};

export default api;
