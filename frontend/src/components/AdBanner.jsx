import { useEffect, useRef } from 'react';

const CLIENT_ID = 'ca-pub-9095450669741543';
const SLOT_ID   = '3418845721';

export default function AdBanner({ format = 'auto', className = '' }) {
  const pushed = useRef(false);
  const insRef = useRef(null);

  useEffect(() => {
    if (pushed.current || !insRef.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense push 오류:', e.message);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={SLOT_ID}
        data-ad-format={format === 'leaderboard' ? 'horizontal' : 'auto'}
        data-full-width-responsive="true"
      />
    </div>
  );
}
