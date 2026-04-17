import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-beige-200 dark:border-navy-700 bg-white dark:bg-navy-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-beige-500 dark:bg-navy-400 flex items-center justify-center">
              <span className="text-white font-black text-xs">DN</span>
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-300">데일리 뉴스</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            본 서비스는 각 언론사 RSS 피드를 통해 뉴스를 제공합니다.<br className="sm:hidden" />
            저작권은 각 언론사에 있으며, 원문 출처를 반드시 확인하세요.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
            <Link to="/privacy" className="hover:text-beige-600 dark:hover:text-navy-300 transition-colors">
              개인정보처리방침
            </Link>
            <span>© {new Date().getFullYear()} 데일리 뉴스</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
