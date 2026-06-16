import { Link } from 'react-router-dom';

const LAST_UPDATED = '2026년 6월 16일';

export default function Terms() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-beige-100 dark:bg-navy-900">
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="mb-10">
          <Link to="/" className="text-sm text-beige-600 dark:text-navy-300 hover:underline mb-4 inline-block">
            ← 홈으로
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">이용약관</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">최종 업데이트: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">

          <section>
            <p>
              데일리 뉴스(Daily News, 이하 "서비스")를 이용해 주셔서 감사합니다.
              본 이용약관은 서비스 이용에 관한 조건과 절차를 규정합니다.
              서비스를 이용하시면 본 약관에 동의하신 것으로 간주합니다.
            </p>
          </section>

          <Section title="제1조 (목적)">
            <p>
              본 약관은 데일리 뉴스가 제공하는 뉴스 큐레이션 서비스의 이용 조건 및 절차,
              이용자와 운영자의 권리·의무 및 책임사항 등을 규정함을 목적으로 합니다.
            </p>
          </Section>

          <Section title="제2조 (용어 정의)">
            <ul className="space-y-2">
              {[
                ['서비스', '데일리 뉴스가 운영하는 웹사이트 및 관련 서비스 일체'],
                ['이용자', '본 서비스에 접속하여 이용하는 모든 사람'],
                ['회원', '이메일 또는 소셜 계정으로 가입하여 서비스를 이용하는 자'],
                ['콘텐츠', '서비스 내 제공되는 뉴스 요약, 카드, 링크 등 모든 정보'],
              ].map(([term, def], i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-semibold text-gray-900 dark:text-white shrink-0">"{term}"</span>
                  <span>: {def}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="제3조 (서비스 이용)">
            <p className="mb-3">서비스는 다음과 같이 제공됩니다.</p>
            <ul className="space-y-1.5">
              {[
                '비회원도 전체 및 주요 카테고리 뉴스를 열람할 수 있습니다.',
                '회원가입 시 카테고리별 맞춤 서비스 및 추가 기능을 이용할 수 있습니다.',
                '서비스는 연중무휴 24시간 제공됩니다. 단, 시스템 점검, 서버 장애 등의 경우 일시 중단될 수 있습니다.',
                '운영자는 서비스 내용을 사전 고지 없이 변경할 수 있습니다.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-beige-500 dark:text-navy-300 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="제4조 (회원가입 및 관리)">
            <ul className="space-y-1.5">
              {[
                '회원가입은 이메일 또는 Google 소셜 로그인으로 가능합니다.',
                '이용자는 정확하고 최신의 정보를 제공해야 합니다.',
                '타인의 정보를 도용하여 가입하는 행위는 금지됩니다.',
                '운영자는 다음에 해당하는 경우 회원 자격을 제한하거나 정지할 수 있습니다: 허위 정보 등록, 서비스 방해 행위, 타 이용자 피해 유발 등.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-beige-500 dark:text-navy-300 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="제5조 (저작권 및 지식재산권)">
            <ul className="space-y-1.5">
              {[
                '서비스에 게재되는 뉴스 기사의 저작권은 각 언론사에 있습니다.',
                '데일리 뉴스의 AI 요약 콘텐츠, 디자인, UI 등의 저작권은 운영자에게 있습니다.',
                '이용자는 서비스의 콘텐츠를 운영자의 사전 동의 없이 복제, 배포, 상업적으로 이용할 수 없습니다.',
                '뉴스 원문에 대한 저작권 문의는 각 언론사에 직접 문의하시기 바랍니다.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-beige-500 dark:text-navy-300 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="제6조 (광고)">
            <ul className="space-y-1.5">
              {[
                '서비스는 Google AdSense를 통해 광고를 게재할 수 있습니다.',
                '광고 콘텐츠의 내용과 정확성에 대한 책임은 광고주에게 있습니다.',
                '이용자는 광고에 관한 문의를 해당 광고주에게 직접 하여야 합니다.',
                'Google AdSense의 쿠키 사용에 대한 자세한 내용은 개인정보처리방침을 참고하세요.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-beige-500 dark:text-navy-300 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="제7조 (면책조항)">
            <ul className="space-y-1.5">
              {[
                '운영자는 천재지변, 시스템 오류 등 불가항력적 사유로 인한 서비스 중단에 대해 책임지지 않습니다.',
                '뉴스 요약은 AI가 생성한 것으로, 원문과 차이가 있을 수 있습니다. 중요한 정보는 반드시 원문을 확인하시기 바랍니다.',
                '서비스를 통해 연결된 외부 웹사이트의 내용에 대해 운영자는 책임지지 않습니다.',
                '이용자 간 또는 이용자와 제3자 간의 분쟁에 대해 운영자는 개입하지 않으며 책임을 지지 않습니다.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-beige-500 dark:text-navy-300 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="제8조 (준거법 및 분쟁 해결)">
            <ul className="space-y-1.5">
              {[
                '본 약관은 대한민국 법률에 따라 해석됩니다.',
                '서비스 이용과 관련한 분쟁은 운영자와 이용자가 성실히 협의하여 해결합니다.',
                '협의가 이루어지지 않을 경우 관할 법원은 민사소송법에 따릅니다.',
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-beige-500 dark:text-navy-300 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="제9조 (약관의 효력 및 변경)">
            <p className="mb-2">
              본 약관은 서비스 화면에 게시하거나 이메일로 공지함으로써 효력이 발생합니다.
              운영자가 약관을 변경할 경우 시행 7일 전에 공지하며, 이용자가 변경 약관에 동의하지 않을 경우
              서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.
            </p>
            <p className="font-semibold">시행일: {LAST_UPDATED}</p>
          </Section>

          <div className="pt-4 border-t border-beige-200 dark:border-navy-700 text-xs text-gray-400 dark:text-gray-500">
            <p>문의: <a href="mailto:jun0615qq@gmail.com" className="underline hover:text-beige-600 dark:hover:text-navy-300">jun0615qq@gmail.com</a></p>
          </div>

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
