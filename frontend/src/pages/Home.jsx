import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import NewsCard from '../components/NewsCard';
import NewsCardSkeleton from '../components/NewsCardSkeleton';
import AdBanner from '../components/AdBanner';
import { newsApi } from '../services/api';

const DEFAULT_CATEGORIES = [{ id: 'all', name: '전체' }];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories]   = useState(DEFAULT_CATEGORIES);
  const activeCategory = searchParams.get('category') || 'all';
  const [news, setNews]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState(null);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  // 현재 요청 중인 카테고리를 추적 (race condition 방지)
  const activeCatRef = useRef('all');
  const loadMoreRef  = useRef(null);

  // 카테고리 목록 로드
  useEffect(() => {
    newsApi.getCategories()
      .then(data => setCategories(data.categories || DEFAULT_CATEGORIES))
      .catch(() => {});
  }, []);

  // ── 뉴스 로드 함수 ────────────────────────────────────────────────────────
  const loadNews = useCallback(async (cat, pg, append = false) => {
    // 요청 시작 전 현재 카테고리 기록
    activeCatRef.current = cat;

    try {
      if (pg === 1) {
        setLoading(true);
        setNews([]);   // ← 카테고리 전환 시 즉시 기존 기사 제거
      } else {
        setLoadingMore(true);
      }

      const data = await newsApi.getNews({ category: cat, page: pg, limit: 12 });

      // 응답이 도착할 때 카테고리가 바뀌어 있으면 무시 (stale response 방지)
      if (activeCatRef.current !== cat) return;

      // 프론트엔드 2차 필터
      const REGION_CATS = ['domestic', 'international'];
      const SPECIAL_CATS = ['all', 'popular'];

      const filtered = SPECIAL_CATS.includes(cat)
        ? data.news                                                    // 전체·인기: 필터 없음
        : cat === 'domestic'
          ? data.news.filter(item => item.region === 'domestic')       // 국내
          : cat === 'international'
            ? data.news.filter(
                item => item.region === 'international' || item.category === 'international'
              )                                                         // 국제
            : data.news.filter(item => item.category === cat);         // 분야별

      setNews(prev => append ? [...prev, ...filtered] : filtered);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      if (activeCatRef.current === cat) setError(err.message);
    } finally {
      if (activeCatRef.current === cat) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  // 카테고리 변경 시 재로드
  useEffect(() => {
    setPage(1);
    loadNews(activeCategory, 1, false);
  }, [activeCategory, loadNews]);

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore && page < totalPages) {
          const next = page + 1;
          setPage(next);
          loadNews(activeCategory, next, true);
        }
      },
      { threshold: 0.5 }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [page, totalPages, loadingMore, activeCategory, loadNews]);

  // 카테고리 변경 핸들러
  function handleCategoryChange(cat) {
    if (cat === activeCategory) return;
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">

      {/* 상단 광고 배너 */}
      <AdBanner slot="top-banner" format="leaderboard" className="mb-6 hidden md:block" />

      {/* 히어로 섹션 */}
      <section className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
          오늘의 뉴스
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          신뢰할 수 있는 출처의 뉴스를 카드 형식으로 빠르게 확인하세요
        </p>
      </section>

      {/* 카테고리 필터 */}
      <div className="sticky top-16 z-40 bg-beige-100/90 dark:bg-navy-900/90 backdrop-blur-md py-3 -mx-4 px-4 mb-6">
        <CategoryFilter
          categories={categories}
          active={activeCategory}
          onChange={handleCategoryChange}
        />
      </div>

      {/* 오류 */}
      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => loadNews(activeCategory, 1, false)} className="btn-primary">
            다시 시도
          </button>
        </div>
      )}

      {/* 뉴스 그리드 */}
      {!error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)
              : news.map((item, index) => (
                  <div key={`${item.id}-${index}`}>
                    <NewsCard news={item} />
                    {(index + 1) % 6 === 0 && (
                      <AdBanner slot="in-feed" format="rectangle" className="mt-6" />
                    )}
                  </div>
                ))
            }
          </div>

          {/* 뉴스 없음 */}
          {!loading && news.length === 0 && (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-beige-300 dark:text-navy-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-400 dark:text-gray-500">이 카테고리의 뉴스가 없습니다.</p>
            </div>
          )}

          {/* 더 불러오기 트리거 */}
          <div ref={loadMoreRef} className="h-10 mt-4 flex items-center justify-center">
            {loadingMore && (
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-beige-400 dark:bg-navy-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* 하단 광고 배너 */}
      <AdBanner slot="bottom-banner" format="leaderboard" className="mt-10" />
    </main>
  );
}
