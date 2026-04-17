import { useState } from 'react';
import { newsApi } from '../services/api';

const CATEGORY_COLORS = {
  politics:      'bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-300',
  economy:       'bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-300',
  society:       'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  international: 'bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-300',
  it:            'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  sports:        'bg-cyan-100   text-cyan-700   dark:bg-cyan-900/40   dark:text-cyan-300',
  entertainment: 'bg-pink-100   text-pink-700   dark:bg-pink-900/40   dark:text-pink-300',
  health:        'bg-lime-100   text-lime-700   dark:bg-lime-900/40   dark:text-lime-300',
};

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)   return '방금 전';
  if (diffMin < 60)  return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)   return `${diffHr}시간 전`;
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export default function NewsCard({ news }) {
  const [imgError, setImgError] = useState(false);
  const categoryColor = CATEGORY_COLORS[news.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

  return (
    <article
      className="news-card group animate-fade-in"
      onClick={() => {
        newsApi.incrementView(news.id); // 조회수 비동기 기록 (fire-and-forget)
        window.open(news.sourceUrl, '_blank', 'noopener,noreferrer');
      }}
    >
      {/* 이미지 (증빙 사진) */}
      <div className="relative h-48 overflow-hidden bg-beige-200 dark:bg-navy-700">
        {news.image && !imgError ? (
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-beige-400 dark:text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* 카테고리 뱃지 */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
          {news.categoryName}
        </span>
      </div>

      {/* 콘텐츠 */}
      <div className="p-5">
        {/* 제목 */}
        <h2 className="font-bold text-base leading-snug text-gray-900 dark:text-white mb-3 line-clamp-2
                       group-hover:text-beige-600 dark:group-hover:text-navy-300 transition-colors">
          {news.title}
        </h2>

        {/* 요약 (개조식 bullet) */}
        {news.summary && (
          <ul className="mb-4 space-y-1.5">
            {news.summary
              .split(/(?<=[.!?])\s+|(?<=\。)\s*/)
              .map(s => s.trim())
              .filter(s => s.length > 5)
              .slice(0, 3)
              .map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 leading-snug">
                  <span className="text-beige-500 dark:text-navy-300 font-bold mt-0.5 shrink-0">•</span>
                  <span>{pt.replace(/[.!?。]$/, '')}</span>
                </li>
              ))}
          </ul>
        )}

        {/* 하단: 출처 + 날짜 */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-beige-100 dark:border-navy-700">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* 출처 아이콘 */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-beige-500 dark:text-navy-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-xs font-medium text-beige-600 dark:text-navy-300 truncate">
              {news.source}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(news.publishedAt)}
            </span>
          </div>
        </div>

        {/* 출처 링크 (접근성용 텍스트) */}
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 truncate" title={news.sourceUrl}>
          출처: <span className="underline">{news.sourceUrl}</span>
        </p>
      </div>
    </article>
  );
}
