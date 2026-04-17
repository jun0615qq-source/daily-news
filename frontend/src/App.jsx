import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';
import UpdateToast from './components/UpdateToast';
import OfflineBanner from './components/OfflineBanner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-beige-100 dark:bg-navy-900 transition-colors duration-300">

            {/* 상단 헤더 */}
            <Header />

            {/* 오프라인 배너 */}
            <OfflineBanner />

            {/* 새 버전 업데이트 알림 */}
            <UpdateToast />

            {/* 메인 콘텐츠 — 모바일은 하단 네비 높이만큼 패딩 */}
            <div className="flex-1 pb-16 md:pb-0">
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <p className="text-6xl font-black text-beige-300 dark:text-navy-700">404</p>
                    <p className="text-gray-500 dark:text-gray-400">페이지를 찾을 수 없습니다.</p>
                    <a href="/" className="btn-primary">홈으로</a>
                  </div>
                } />
              </Routes>
            </div>

            {/* PC 푸터 (모바일은 하단 네비로 대체) */}
            <div className="hidden md:block">
              <Footer />
            </div>

            {/* 모바일 하단 네비게이션 */}
            <BottomNav />

            {/* PWA 설치 유도 배너 */}
            <InstallPrompt />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
