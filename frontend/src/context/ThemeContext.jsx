import { createContext, useContext, useState, useEffect } from 'react';

// 'beige' = 베이지/화이트 | 'navy' = 다크 네이비
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dn-theme') || 'beige';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'navy') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('dn-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => (t === 'beige' ? 'navy' : 'beige'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme는 ThemeProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
