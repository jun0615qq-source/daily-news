import { useEffect, useState } from 'react';
import { openInExternalBrowser } from '../context/AuthContext';

export default function WebViewWarning() {
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // 페이지 진입 즉시 외부 브라우저로 자동 이동 시도
    openInExternalBrowser();
    // 2초 후에도 페이지에 있으면 수동 버튼 표시
    const timer = setTimeout(() => setRedirected(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua);

  if (!redirected) {
    return (
      <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 text-center">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          외부 브라우저로 이동 중...
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700">
      <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
        구글 로그인은 외부 브라우저에서만 가능합니다
      </p>
      <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
        {isAndroid
          ? '아래 버튼을 눌러 Chrome에서 열어주세요.'
          : '아래 버튼을 눌러 Safari에서 열어주세요.'}
      </p>
      <button
        onClick={openInExternalBrowser}
        className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors"
      >
        {isAndroid ? 'Chrome으로 열기' : 'Safari로 열기'}
      </button>
    </div>
  );
}
