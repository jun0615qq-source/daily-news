import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/');
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-navy-800/90 backdrop-blur-md
                       border-b border-beige-200 dark:border-navy-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-lg bg-beige-500 dark:bg-navy-400 flex items-center justify-center">
            <span className="text-white font-black text-sm">DN</span>
          </div>
          <div>
            <span className="font-black text-lg text-gray-900 dark:text-white tracking-tight">데일리 뉴스</span>
            <span className="hidden sm:inline text-xs text-gray-400 dark:text-gray-500 ml-1">Daily News</span>
          </div>
        </Link>

        {/* 오른쪽 액션 */}
        <div className="flex items-center gap-2">
          {/* 테마 토글 */}
          <button
            onClick={toggleTheme}
            aria-label="테마 변경"
            className="w-9 h-9 rounded-full flex items-center justify-center
                       text-gray-500 dark:text-gray-300 hover:bg-beige-100 dark:hover:bg-navy-700
                       transition-colors"
          >
            {theme === 'beige' ? (
              /* Moon icon */
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              /* Sun icon */
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l-.71-.71M12 5a7 7 0 100 14A7 7 0 0012 5z" />
              </svg>
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl
                           bg-beige-100 dark:bg-navy-700 hover:bg-beige-200 dark:hover:bg-navy-600
                           transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-beige-500 dark:bg-navy-400 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {(user.displayName || user.email)?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                  {user.displayName || user.email}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-navy-800 rounded-xl shadow-lg
                                border border-beige-200 dark:border-navy-700 py-1 animate-fade-in">
                  <div className="px-4 py-2 text-xs text-gray-400 dark:text-gray-500 border-b border-beige-100 dark:border-navy-700 truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-navy-700 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">로그인</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">회원가입</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
