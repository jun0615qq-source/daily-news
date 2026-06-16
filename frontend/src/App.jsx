import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, isWebView } from './context/AuthContext';
import useAnalytics from './hooks/useAnalytics';
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
import Privacy from './pages/Privacy';
import About from './pages/About';
import Terms from './pages/Terms';

function WebViewBanner() {
  if (!isWebView()) return null;
  return (
    <div className="bg-amber-500 text-white text-xs px-4 py-2 text-center">
      카카오톡에서는 이메일로 회원가입/로그인해 주세요
    </div>
  );
}

function AppInner() {
  useAnalytics();
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-beige-100 dark:bg-navy-900 transition-colors duration-300">

            {/* Google Analytics 페이지뷰 추적 */}
            <AppInner />

            {/* 상단 헤더 */}
            <Header />

            {/* 카카오톡 인앱 브라우저 경고 */}
            <WebViewBanner />

            {/* 오프라인 배너 */}
            <OfflineBanner />

            {/* 새 버전 업데이트 알림 */}
            <UpdateToast />

            {/* 메인 콘텐츠 — 모바일은 하단 네비 높이만큼 패딩 */}
            <div className="flex-1 pb-16 md:pb-0">
              <Routes>
                <Route path="/"         element={<Home />} />
                <Route path="/landing"  element={<Navigate to="/" replace />} />
                <Route path="/login"    element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy"  element={<Privacy />} />
                <Route path="/about"    element={<About />} />
                <Route path="/terms"    element={<Terms />} />
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
