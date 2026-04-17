// 그룹별 레이블 (구분선 텍스트)
const GROUP_LABELS = {
  special: null,       // 레이블 없음
  region:  '지역',
  topic:   '분야',
};

export default function CategoryFilter({ categories, active, onChange }) {
  // 그룹별로 분류
  const groups = categories.reduce((acc, cat) => {
    const g = cat.group || 'topic';
    if (!acc[g]) acc[g] = [];
    acc[g].push(cat);
    return acc;
  }, {});

  const groupOrder = ['special', 'region', 'topic'];

  return (
    <div className="flex items-center gap-1 overflow-x-auto category-scroll py-1">
      {groupOrder.map((groupId, gi) => {
        const items = groups[groupId];
        if (!items?.length) return null;

        return (
          <div key={groupId} className="flex items-center gap-1 shrink-0">
            {/* 그룹 구분선 (첫 번째 그룹 제외) */}
            {gi > 0 && (
              <div className="flex items-center gap-1 mx-1">
                <div className="w-px h-5 bg-beige-300 dark:bg-navy-600" />
                {GROUP_LABELS[groupId] && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
                    {GROUP_LABELS[groupId]}
                  </span>
                )}
              </div>
            )}

            {/* 카테고리 칩들 */}
            {items.map(cat => (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className={`category-chip flex items-center gap-1 ${
                  active === cat.id ? 'category-chip-active' : 'category-chip-inactive'
                }`}
              >
                {/* 인기뉴스 아이콘 */}
                {cat.id === 'popular' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
                {/* 국내 아이콘 */}
                {cat.id === 'domestic' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )}
                {/* 국제 아이콘 */}
                {cat.id === 'international' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {cat.name}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
