import usePWA from '../hooks/usePWA';

export default function InstallPrompt() {
  const { showBanner, isIOS, install, dismiss } = usePWA();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up sm:left-auto sm:right-4 sm:w-80">
      <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-beige-200 dark:border-navy-600 p-4">
        <div className="flex items-start gap-3">
          {/* 앱 아이콘 */}
          <div className="w-12 h-12 rounded-xl bg-beige-500 dark:bg-navy-400 flex items-center justify-center shrink-0">
            <span className="text-white font-black text-lg">DN</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 dark:text-white">데일리 뉴스 앱 설치</p>

            {isIOS ? (
              /* iOS Safari 전용 안내 */
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                Safari 하단의{' '}
                <span className="inline-flex items-center gap-0.5 font-medium text-beige-600 dark:text-navy-300">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  공유
                </span>
                {' '}→{' '}
                <span className="font-medium text-beige-600 dark:text-navy-300">홈 화면에 추가</span>
                를 탭하세요
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                홈 화면에 추가하면 앱처럼 바로 실행할 수 있어요
              </p>
            )}

            {!isIOS && (
              <button
                onClick={install}
                className="mt-3 w-full py-2 rounded-xl text-xs font-semibold
                           bg-beige-500 dark:bg-navy-400 text-white
                           hover:bg-beige-600 dark:hover:bg-navy-300 transition-colors"
              >
                홈 화면에 추가
              </button>
            )}
          </div>

          {/* 닫기 */}
          <button
            onClick={dismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0 mt-0.5"
            aria-label="닫기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
