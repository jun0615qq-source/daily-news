import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_ID;

// GA4 스크립트 동적 삽입 (VITE_GA_ID가 설정된 경우에만)
function initGA() {
  if (!GA_ID || document.getElementById('ga-script')) return;

  const script1 = document.createElement('script');
  script1.id  = 'ga-script';
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script1.async = true;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });
}

// 페이지뷰 전송
function sendPageView(path) {
  if (!GA_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
  });
}

// 커스텀 이벤트 전송 (외부에서 직접 호출)
export function trackEvent(eventName, params = {}) {
  if (!GA_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

// React Router와 연동해 페이지 전환마다 pageview 전송
export default function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    sendPageView(location.pathname + location.search);
  }, [location]);
}
