import { useState, useEffect } from 'react';

export default function UpdateToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // main.jsx에서 호출할 전역 함수 등록
    window.__showUpdateToast = () => setShow(true);
    return () => { delete window.__showUpdateToast; };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80 animate-slide-up">
      <div className="bg-navy-700 dark:bg-navy-600 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">새 버전이 있습니다</p>
          <p className="text-xs text-white/70 mt-0.5">새로고침하면 최신 버전으로 업데이트됩니다</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
        >
          업데이트
        </button>
        <button onClick={() => setShow(false)} className="text-white/60 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
