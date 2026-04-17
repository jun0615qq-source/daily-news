import { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithPopup,
} from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── 이메일/비밀번호 회원가입 ──────────────────────────────────────────────
  async function register(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await sendEmailVerification(cred.user);
    return cred.user;
  }

  // ── 이메일/비밀번호 로그인 ────────────────────────────────────────────────
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // ── 구글 로그인 ───────────────────────────────────────────────────────────
  async function loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  // ── 로그아웃 ──────────────────────────────────────────────────────────────
  async function logout() {
    return signOut(auth);
  }

  // ── 비밀번호 재설정 ───────────────────────────────────────────────────────
  async function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // ── Firebase ID 토큰 (백엔드 인증용) ─────────────────────────────────────
  async function getToken() {
    if (!user) return null;
    return user.getIdToken();
  }

  const value = { user, loading, register, login, loginWithGoogle, logout, resetPassword, getToken };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
