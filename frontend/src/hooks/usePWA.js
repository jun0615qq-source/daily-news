import { useState, useEffect } from 'react';

/**
 * PWA 설치 프롬프트 + 설치 상태를 관리하는 훅
 *
 * 반환값:
 *   isInstallable  — 설치 배너를 보여줄 수 있는 상태
 *   isInstalled    — 이미 standalone 모드로 실행 중
 *   isIOS          — iOS Safari (별도 안내 필요)
 *   install()      — 설치 프롬프트 실행
 *   dismiss()      — 배너 닫기 (24시간 숨김)
 */
export default function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setInstallable]     = useState(false);
  const [dismissed, setDismissed]           = useState(false);

  const isInstalled = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    && !window.navigator.standalone;

  useEffect(() => {
    // 24시간 내 닫힌 경우 배너 숨김
    const lastDismiss = localStorage.getItem('pwa-dismiss-time');
    if (lastDismiss && Date.now() - Number(lastDismiss) < 24 * 60 * 60 * 1000) {
      setDismissed(true);
      return;
    }

    const handler = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setInstallable(false);
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
    }
  }

  function dismiss() {
    localStorage.setItem('pwa-dismiss-time', String(Date.now()));
    setDismissed(true);
    setInstallable(false);
  }

  const showBanner = !isInstalled && !dismissed && (isInstallable || isIOS);

  return { isInstallable, isInstalled, isIOS, showBanner, install, dismiss };
}
