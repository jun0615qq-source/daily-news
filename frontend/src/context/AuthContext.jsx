import { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from '../firebase';

export function isWebView() {
  const ua = navigator.userAgent || '';
  return /KAKAOTALK|KAKAO|kakaotalk|Instagram|FBAV|FBAN|FB_IAB|FB_AN|Line\/|Snapchat|Twitter|wv\b|WebView/i.test(ua)
    || (ua.includes('Android') && /Version\/\d/.test(ua) && !ua.includes('Chrome'));
}

export function openInExternalBrowser() {
  const url = window.location.href;
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua)) {
    const host = url.replace(/^https?:\/\//, '');
    window.location.href = `intent://${host}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
  } else if (/iPhone|iPad|iPod/i.test(ua)) {
    window.location.href = url.replace(/^https:\/\//, 'x-safari-https://');
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }

    getRedirectResult(auth).then(result => {
      if (result?.user) setUser(result.user);
    }).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, async u => {
      // 이메일/비밀번호 가입 후 이메일 미인증 유저는 즉시 로그아웃
      if (u && u.providerData.some(p => p.providerId === 'password') && !u.emailVerified) {
        await signOut(auth);
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ── 이메일/비밀번호 로그인 ────────────────────────────────────────────────
  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      const err = new Error('EMAIL_NOT_VERIFIED');
      err.code = 'auth/email-not-verified';
      throw err;
    }
    return cred;
  }

  // ── 커스텀 토큰으로 로그인 (이메일 인증 코드 후) ─────────────────────────
  async function loginWithCustomToken(customToken) {
    return signInWithCustomToken(auth, customToken);
  }

  // ── 구글 로그인 ───────────────────────────────────────────────────────────
  async function loginWithGoogle() {
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err?.code === 'auth/popup-blocked' || err?.code === 'auth/popup-closed-by-user') {
        return signInWithRedirect(auth, googleProvider);
      }
      throw err;
    }
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

  const value = { user, loading, login, loginWithCustomToken, loginWithGoogle, logout, resetPassword, getToken };
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
