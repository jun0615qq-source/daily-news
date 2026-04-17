import { Link } from 'react-router-dom';

const LAST_UPDATED = '2026년 4월 17일';

export default function Privacy() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-beige-100 dark:bg-navy-900">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* 헤더 */}
        <div className="mb-10">
          <Link to="/" className="text-sm text-beige-600 dark:text-navy-300 hover:underline mb-4 inline-block">
            ← 홈으로
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">개인정보처리방침</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">최종 업데이트: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">

          <section>
            <p>
              데일리 뉴스(이하 "서비스")는 이용자의 개인정보를 소중히 여기며,
              「개인정보 보호법」 등 관련 법령을 준수합니다.
              본 방침은 서비스가 수집하는 개인정보의 항목, 수집 목적, 보유 기간 및
              이용자의 권리에 대해 안내합니다.
            </p>
          </section>

          <Section title="1. 수집하는 개인정보 항목">
            <p className="mb-3">서비스는 회원가입·로그인 시 다음 정보를 수집합니다.</p>
            <Table
              headers={['구분', '항목', '수집 방법']}
              rows={[
                ['이메일 회원가입', '이메일 주소, 닉네임(선택)', '이용자 직접 입력'],
                ['Google 소셜 로그인', '이메일 주소, 이름, 프로필 사진(선택)', 'Google OAuth 연동'],
              ]}
            />
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              * 비밀번호는 Firebase Authentication에 의해 암호화 저장되며, 서비스 운영자는 조회할 수 없습니다.
            </p>
          </Section>

          <Section title="2. 개인정보 수집 및 이용 목적">
            <ul className="space-y-1.5 list-none">
              {[
                '회원 식별 및 로그인 서비스 제공',
                '서비스 이용 통계 분석 (집계 데이터, 개인 식별 불가)',
                '부정 이용 방지 및 보안 관리',
                '서비스 공지사항 전달 (선택)',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-beige-500 dark:text-navy-300 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="3. 개인정보 보유 및 이용 기간">
            <p className="mb-3">
              수집한 개인정보는 회원 탈퇴 시 즉시 삭제합니다.
              단, 관련 법령에 따라 아래 기간 동안 보관할 수 있습니다.
            </p>
            <Table
              headers={['근거 법령', '보존 항목', '보존 기간']}
              rows={[
                ['전자상거래 등에서의 소비자 보호에 관한 법률', '소비자 불만 기록', '3년'],
                ['통신비밀보호법', '서비스 접속 로그', '3개월'],
              ]}
            />
          </Section>

          <Section title="4. 개인정보의 제3자 제공">
            <p>
              서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
              단, 법령에 의한 수사기관의 요청이 있는 경우 예외로 합니다.
            </p>
          </Section>

          <Section title="5. 개인정보 처리 위탁">
            <p className="mb-3">서비스는 원활한 운영을 위해 아래 업체에 일부 업무를 위탁합니다.</p>
            <Table
              headers={['수탁 업체', '위탁 업무', '보유 기간']}
              rows={[
                ['Google Firebase (Google LLC)', '회원 인증, 데이터 저장', '회원 탈퇴 시까지'],
                ['Vercel Inc.', '웹 서비스 호스팅', '서비스 종료 시까지'],
                ['Render Inc.', '백엔드 서버 운영', '서비스 종료 시까지'],
              ]}
            />
          </Section>

          <Section title="6. 이용자의 권리">
            <p className="mb-3">이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
            <ul className="space-y-1.5">
              {[
                '개인정보 열람 요청',
                '개인정보 정정·삭제 요청',
                '개인정보 처리 정지 요청',
                '회원 탈퇴 (서비스 내 탈퇴 기능 또는 이메일 문의)',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-beige-500 dark:text-navy-300 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="7. 쿠키(Cookie) 및 분석 도구">
            <p>
              서비스는 로그인 상태 유지를 위해 Firebase가 설정하는 세션 쿠키를 사용합니다.
              브라우저 설정에서 쿠키를 비활성화할 수 있으나, 일부 기능이 제한될 수 있습니다.
            </p>
          </Section>

          <Section title="8. 개인정보 보호책임자">
            <Table
              headers={['항목', '내용']}
              rows={[
                ['서비스명', '데일리 뉴스 (Daily News)'],
                ['이메일', 'jun0615qq@gmail.com'],
              ]}
            />
            <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
              개인정보 관련 문의는 위 이메일로 연락해 주세요. 영업일 기준 3일 이내 답변드립니다.
            </p>
          </Section>

          <Section title="9. 개인정보처리방침 변경">
            <p>
              본 방침은 법령 또는 서비스 변경 시 사전 공지 후 개정됩니다.
              변경 시 시행 7일 전에 공지합니다.
            </p>
            <p className="mt-2 font-semibold">시행일: {LAST_UPDATED}</p>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3 pb-2
                     border-b border-beige-200 dark:border-navy-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-beige-200 dark:border-navy-700">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-beige-100 dark:bg-navy-800">
            {headers.map(h => (
              <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-beige-200 dark:border-navy-700 bg-white dark:bg-navy-900">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-gray-600 dark:text-gray-400">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
