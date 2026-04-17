import { useEffect, useRef } from 'react';

/**
 * Google AdSense 배너 컴포넌트
 * VITE_ADSENSE_CLIENT 환경 변수에 퍼블리셔 ID를 설정하면 실제 광고가 표시됩니다.
 *
 * AdSense 설정 방법:
 * 1. https://adsense.google.com 에서 계정 생성
 * 2. 웹사이트 등록 및 승인
 * 3. .env 파일에 VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX 입력
 * 4. index.html의 AdSense 스크립트 주석 해제
 */
export default function AdBanner({ slot = 'auto', format = 'auto', className = '' }) {
  const adRef = useRef(null);
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT;
  const isConfigured = clientId && clientId !== 'ca-pub-XXXXXXXXXXXXXXXX';

  useEffect(() => {
    if (!isConfigured || !adRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense 로드 실패:', e.message);
    }
  }, [isConfigured]);

  if (!isConfigured) {
    return (
      <div className={`ad-banner ${className}`}>
        <div className="text-center">
          <p className="text-xs">광고 영역</p>
          <p className="text-[10px] mt-0.5">AdSense 설정 후 실제 광고가 표시됩니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
