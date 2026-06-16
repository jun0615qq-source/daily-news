import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-beige-100 dark:bg-navy-900">
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-10">
          <Link to="/" className="text-sm text-beige-600 dark:text-navy-300 hover:underline mb-4 inline-block">
            ← 홈으로
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">서비스 소개</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">데일리 뉴스 (Daily News) 에 대해 알아보세요</p>
        </div>

        <div className="space-y-10 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">

          <section className="bg-white dark:bg-navy-800 rounded-2xl border border-beige-200 dark:border-navy-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">데일리 뉴스란?</h2>
            <p className="mb-3">
              데일리 뉴스(Daily News)는 국내 주요 언론사의 뉴스를 실시간으로 수집하여
              AI가 핵심 내용을 3줄로 요약해 제공하는 뉴스 큐레이션 서비스입니다.
            </p>
            <p>
              바쁜 현대인이 짧은 시간 안에 오늘의 주요 뉴스를 파악할 수 있도록
              카드 형식의 직관적인 UI로 정치, 경제, 사회, IT, 스포츠, 엔터테인먼트,
              건강, 국제 등 9개 카테고리의 뉴스를 제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-beige-200 dark:border-navy-700">
              주요 기능
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '📰', title: 'AI 3줄 요약', desc: '복잡한 뉴스를 핵심 3가지 포인트로 요약하여 빠른 정보 습득을 돕습니다.' },
                { icon: '⚡', title: '실시간 업데이트', desc: '5분마다 주요 언론사 RSS를 수집하여 최신 뉴스를 제공합니다.' },
                { icon: '🗂️', title: '9개 카테고리', desc: '정치, 경제, 사회, 국제, IT/과학, 스포츠, 연예, 건강, 인기 뉴스로 분류합니다.' },
                { icon: '🔗', title: '원문 출처 명시', desc: '모든 뉴스 카드에 원문 출처 언론사와 링크를 명확하게 표시합니다.' },
                { icon: '📱', title: 'PWA 지원', desc: '스마트폰 홈 화면에 앱처럼 설치하여 편리하게 이용할 수 있습니다.' },
                { icon: '🌙', title: '다크 모드', desc: '눈이 편안한 다크 모드를 지원하여 언제 어디서든 편하게 읽을 수 있습니다.' },
              ].map((f, i) => (
                <div key={i} className="bg-white dark:bg-navy-800 rounded-xl border border-beige-200 dark:border-navy-700 p-4">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-beige-200 dark:border-navy-700">
              뉴스 출처
            </h2>
            <p className="mb-3">
              데일리 뉴스는 국내 주요 언론사의 공식 RSS 피드를 통해 뉴스를 수집합니다.
              제공되는 모든 기사의 저작권은 해당 언론사에 귀속되며,
              원문 기사 링크를 통해 전체 내용을 확인하실 수 있습니다.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-xs text-amber-700 dark:text-amber-300">
              본 서비스는 뉴스 원문을 게재하지 않으며, AI 요약 제공 후 반드시 원문 출처 링크를 통해
              전체 기사를 확인하도록 안내합니다. 저작권법을 준수합니다.
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-beige-200 dark:border-navy-700">
              운영 정보
            </h2>
            <div className="overflow-x-auto rounded-xl border border-beige-200 dark:border-navy-700">
              <table className="w-full text-xs">
                <tbody>
                  {[
                    ['서비스명', '데일리 뉴스 (Daily News)'],
                    ['서비스 유형', '뉴스 큐레이션 / AI 요약 서비스'],
                    ['운영 국가', '대한민국'],
                    ['서비스 언어', '한국어'],
                    ['운영자 이메일', 'jun0615qq@gmail.com'],
                    ['서비스 시작일', '2026년'],
                  ].map(([label, value], i) => (
                    <tr key={i} className={`border-t border-beige-200 dark:border-navy-700 ${i === 0 ? 'border-t-0' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-400 bg-beige-50 dark:bg-navy-800 w-1/3">{label}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-navy-900">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-beige-200 dark:border-navy-700">
              광고 안내
            </h2>
            <p className="mb-3">
              데일리 뉴스는 Google AdSense를 통해 광고를 게재합니다.
              광고 수익은 서비스 운영 및 서버 유지에 사용됩니다.
            </p>
            <p>
              Google AdSense는 사용자의 관심사에 맞는 광고를 표시하기 위해 쿠키를 사용할 수 있습니다.
              광고 개인화는 Google의 개인정보처리방침에 따라 관리됩니다.
              광고 개인화를 원하지 않으시면{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-beige-600 dark:text-navy-300 underline"
              >
                Google 광고 설정
              </a>
              에서 조정하실 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-beige-200 dark:border-navy-700">
              문의하기
            </h2>
            <p className="mb-3">
              서비스 이용 중 문의사항, 오류 신고, 저작권 관련 문의는 아래 이메일로 연락해 주세요.
              영업일 기준 3일 이내 답변드립니다.
            </p>
            <a
              href="mailto:jun0615qq@gmail.com"
              className="inline-flex items-center gap-2 bg-beige-500 dark:bg-navy-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              jun0615qq@gmail.com
            </a>
          </section>

        </div>
      </div>
    </div>
  );
}
