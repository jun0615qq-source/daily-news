import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  {
    to: '/',
    label: '홈',
    icon: (active) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/?category=it',
    label: 'IT',
    icon: (active) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to: '/?category=economy',
    label: '경제',
    icon: (active) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    to: '/?category=sports',
    label: '스포츠',
    icon: (active) => (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24M18.07 4.93l-4.24 4.24" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { user } = useAuth();

  return (
    /* pb-safe → iOS Safe Area(홈 바) 패딩 */
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden
                    bg-white/95 dark:bg-navy-800/95 backdrop-blur-md
                    border-t border-beige-200 dark:border-navy-700
                    pb-safe">
      <div className="flex items-center justify-around h-14 px-2">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors
               ${isActive
                 ? 'text-beige-500 dark:text-navy-300'
                 : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {item.icon(isActive)}
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* 로그인/프로필 */}
        <NavLink
          to={user ? '.' : '/login'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors
             ${isActive ? 'text-beige-500 dark:text-navy-300' : 'text-gray-400 dark:text-gray-500'}`
          }
        >
          {({ isActive }) =>
            user ? (
              <>
                <div className="w-6 h-6 rounded-full bg-beige-500 dark:bg-navy-400 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">
                    {(user.displayName || user.email)?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] font-medium">MY</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={isActive ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[10px] font-medium">로그인</span>
              </>
            )
          }
        </NavLink>
      </div>
    </nav>
  );
}
