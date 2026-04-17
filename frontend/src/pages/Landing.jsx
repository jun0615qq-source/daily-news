import { Link } from 'react-router-dom';

const PREVIEW_CARDS = [
  { category: '정치', color: 'bg-red-100 text-red-700', title: '국회 본회의 주요 법안 처리 일정 확정', points: ['여야 합의로 3개 법안 상정 예정', '다음 주 본회의 표결 진행', '민생 지원 예산안 포함'] },
  { category: '경제', color: 'bg-green-100 text-green-700', title: '코스피 2,600선 회복…외국인 순매수', points: ['외국인 3거래일 연속 순매수', '반도체·자동차 업종 강세', '원/달러 환율 1,320원대 안정'] },
  { category: 'IT/과학', color: 'bg-violet-100 text-violet-700', title: '국내 AI 반도체 수출 역대 최고치 기록', points: ['1분기 수출액 전년比 42% 증가', 'HBM 메모리 글로벌 수요 급증', '주요 빅테크 공급 계약 확대'] },
];

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-beige-100 dark:bg-navy-900">

      {/* 히어로 섹션 */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-beige-500 dark:bg-navy-400 flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-black text-2xl">DN</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
          오늘의 뉴스를<br />
          <span className="text-beige-500 dark:text-navy-300">카드 한 장</span>으로
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
          신뢰할 수 있는 출처의 뉴스를 AI가 3줄로 요약해 드립니다.
          정치·경제·IT·스포츠 등 9개 카테고리를 한눈에 확인하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register" className="btn-primary text-base py-3 px-8">
            무료로 시작하기
          </Link>
          <Link to="/login" className="btn-secondary text-base py-3 px-8">
            로그인
          </Link>
        </div>
      </section>

      {/* 미리보기 카드 */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-6">
          — 이런 뉴스카드를 매일 받아보세요 —
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PREVIEW_CARDS.map((card, i) => (
            <div key={i} className="news-card pointer-events-none select-none opacity-90">
              <div className="h-32 bg-beige-200 dark:bg-navy-700 flex items-center justify-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-beige-400 dark:text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${card.color}`}>
                  {card.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3 line-clamp-2">{card.title}</h3>
                <ul className="space-y-1.5">
                  {card.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="text-beige-500 dark:text-navy-300 font-bold mt-0.5 shrink-0">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 특징 */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { icon: '📰', title: '출처 명시', desc: '모든 뉴스에 원문 출처 표시' },
            { icon: '⚡', title: '실시간 업데이트', desc: '5분마다 최신 뉴스 자동 수집' },
            { icon: '🔒', title: '안전한 로그인', desc: 'Firebase 보안 인증' },
          ].map((f, i) => (
            <div key={i} className="text-center p-4 bg-white dark:bg-navy-800 rounded-2xl border border-beige-200 dark:border-navy-700">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{f.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
