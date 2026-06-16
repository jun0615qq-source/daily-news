import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-beige-200 dark:border-navy-700 bg-white dark:bg-navy-800">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* 상단: 로고 + 설명 */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-beige-500 dark:bg-navy-400 flex items-center justify-center">
                <span className="text-white font-black text-xs">DN</span>
              </div>
              <span className="font-bold text-gray-700 dark:text-gray-300">데일리 뉴스</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed">
              신뢰할 수 있는 출처의 뉴스를 AI가 3줄로 요약해 드립니다.<br />
              매일 최신 뉴스를 카드로 빠르게 확인하세요.
            </p>
          </div>

          {/* 네비게이션 링크 */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 sm:ml-auto">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">서비스</p>
              <ul className="space-y-1.5">
                <li><Link to="/" className="text-xs text-gray-400 dark:text-gray-500 hover:text-beige-600 dark:hover:text-navy-300 transition-colors">홈</Link></li>
                <li><Link to="/about" className="text-xs text-gray-400 dark:text-gray-500 hover:text-beige-600 dark:hover:text-navy-300 transition-colors">서비스 소개</Link></li>
                <li><Link to="/register" className="text-xs text-gray-400 dark:text-gray-500 hover:text-beige-600 dark:hover:text-navy-300 transition-colors">회원가입</Link></li>
                <li><Link to="/login" className="text-xs text-gray-400 dark:text-gray-500 hover:text-beige-600 dark:hover:text-navy-300 transition-colors">로그인</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">법적 고지</p>
              <ul className="space-y-1.5">
                <li><Link to="/privacy" className="text-xs text-gray-400 dark:text-gray-500 hover:text-beige-600 dark:hover:text-navy-300 transition-colors">개인정보처리방침</Link></li>
                <li><Link to="/terms" className="text-xs text-gray-400 dark:text-gray-500 hover:text-beige-600 dark:hover:text-navy-300 transition-colors">이용약관</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">문의</p>
              <ul className="space-y-1.5">
                <li>
                  <a
                    href="mailto:jun0615qq@gmail.com"
                    className="text-xs text-gray-400 dark:text-gray-500 hover:text-beige-600 dark:hover:text-navy-300 transition-colors"
                  >
                    jun0615qq@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-beige-100 dark:border-navy-700 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
              본 서비스는 각 언론사 RSS 피드를 통해 뉴스를 제공합니다.
              저작권은 각 언론사에 있으며, 원문 출처를 반드시 확인하세요.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
              © {new Date().getFullYear()} 데일리 뉴스. All rights reserved.
            </p>
          </div>
          <p className="text-xs text-gray-300 dark:text-gray-600 text-center mt-3">
            본 사이트는 Google AdSense를 통해 광고를 게재합니다.{' '}
            <Link to="/privacy" className="underline hover:text-beige-500 dark:hover:text-navy-400">
              개인정보처리방침
            </Link>
            에서 쿠키 및 광고 관련 정책을 확인하세요.
          </p>
        </div>

      </div>
    </footer>
  );
}
