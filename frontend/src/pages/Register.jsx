import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 비밀번호 강도 계산
function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8)              score++;
  if (pw.length >= 12)             score++;
  if (/[A-Z]/.test(pw))            score++;
  if (/[0-9]/.test(pw))            score++;
  if (/[^A-Za-z0-9]/.test(pw))    score++;
  if (score <= 1) return { label: '매우 약함', color: 'bg-red-500',    width: '20%' };
  if (score === 2) return { label: '약함',    color: 'bg-orange-500', width: '40%' };
  if (score === 3) return { label: '보통',    color: 'bg-yellow-500', width: '60%' };
  if (score === 4) return { label: '강함',    color: 'bg-blue-500',   width: '80%' };
  return { label: '매우 강함', color: 'bg-green-500', width: '100%' };
}

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ displayName: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [done, setDone]       = useState(false);

  const strength = form.password ? getPasswordStrength(form.password) : null;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  function validate() {
    if (!form.displayName.trim())                           return '이름을 입력하세요.';
    if (!form.email.trim())                                 return '이메일을 입력하세요.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))    return '올바른 이메일 형식을 입력하세요.';
    if (form.password.length < 8)                           return '비밀번호는 8자 이상이어야 합니다.';
    if (!/[A-Z]/.test(form.password))                       return '비밀번호에 대문자를 포함하세요.';
    if (!/[0-9]/.test(form.password))                       return '비밀번호에 숫자를 포함하세요.';
    if (form.password !== form.confirm)                     return '비밀번호가 일치하지 않습니다.';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await register(form.email.trim(), form.password, form.displayName.trim());
      setDone(true);
    } catch (err) {
      const map = {
        'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
        'auth/weak-password':        '비밀번호가 너무 약합니다.',
        'auth/invalid-email':        '올바른 이메일 형식을 입력하세요.',
      };
      setError(map[err.code] || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch {
      setError('구글 회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-beige-200 dark:border-navy-700 animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">회원가입 완료!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            이메일 인증 메일을 발송했습니다.<br />
            이메일을 확인한 후 로그인하세요.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full">로그인 페이지로</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-xl p-8 border border-beige-200 dark:border-navy-700 animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-beige-500 dark:bg-navy-400 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-xl">DN</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">회원가입</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">데일리 뉴스를 시작하세요</p>
          </div>

          {/* 구글 */}
          <button onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                       border border-beige-300 dark:border-navy-600 bg-white dark:bg-navy-900
                       text-gray-700 dark:text-gray-200 font-medium text-sm
                       hover:bg-beige-50 dark:hover:bg-navy-700 transition-colors mb-5 disabled:opacity-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google로 가입
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-beige-200 dark:border-navy-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-navy-800">또는 이메일로 가입</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">이름</label>
              <input type="text" name="displayName" autoComplete="name"
                value={form.displayName} onChange={handleChange}
                placeholder="홍길동" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">이메일</label>
              <input type="email" name="email" autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="example@email.com" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">비밀번호</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" autoComplete="new-password"
                  value={form.password} onChange={handleChange}
                  placeholder="8자 이상, 대문자+숫자 포함" className="input-field pr-10" required />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              {/* 비밀번호 강도 표시 */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1.5 bg-beige-200 dark:bg-navy-700 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} rounded-full transition-all duration-300`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">강도: {strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">비밀번호 확인</label>
              <input type="password" name="confirm" autoComplete="new-password"
                value={form.confirm} onChange={handleChange}
                placeholder="비밀번호 재입력" className="input-field" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-50">
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-semibold text-beige-600 dark:text-navy-300 hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
