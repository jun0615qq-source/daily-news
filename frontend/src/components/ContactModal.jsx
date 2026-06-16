import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ContactModal({ onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrorMsg('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', form);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || '전송에 실패했습니다.');
      setStatus('error');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white dark:bg-navy-800 rounded-3xl shadow-2xl
                      border border-beige-200 dark:border-navy-700 p-6 animate-slide-up">

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-black text-gray-900 dark:text-white">문의하기</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full
                       text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                       hover:bg-beige-100 dark:hover:bg-navy-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-bold text-gray-900 dark:text-white mb-1">문의가 전송되었습니다</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">빠른 시일 내에 답변 드리겠습니다.</p>
            <button onClick={onClose} className="btn-primary mt-6 px-8">닫기</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">이름</label>
              <input
                name="name" value={form.name} onChange={handleChange}
                placeholder="홍길동"
                className="input-field" required maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">이메일</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="example@email.com"
                className="input-field" required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">문의 내용</label>
              <textarea
                name="message" value={form.message} onChange={handleChange}
                placeholder="문의 내용을 입력해 주세요. (최소 10자)"
                rows={5} maxLength={2000}
                className="input-field resize-none"
                required minLength={10}
              />
              <p className="text-right text-xs text-gray-400 mt-1">{form.message.length} / 2000</p>
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl">
                {errorMsg}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">취소</button>
              <button type="submit" disabled={status === 'loading'} className="btn-primary flex-1 py-3 disabled:opacity-50">
                {status === 'loading' ? '전송 중...' : '전송하기'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
