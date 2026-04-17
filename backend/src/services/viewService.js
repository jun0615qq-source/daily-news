const NodeCache = require('node-cache');

// 조회수 캐시 (24시간 TTL — 하루 기준 인기뉴스)
const viewCache = new NodeCache({ stdTTL: 24 * 60 * 60, useClones: false });

/**
 * 특정 기사 조회수 1 증가
 */
function incrementView(newsId) {
  const current = viewCache.get(newsId) || 0;
  const next = current + 1;
  viewCache.set(newsId, next);
  return next;
}

/**
 * 특정 기사 조회수 반환
 */
function getViewCount(newsId) {
  return viewCache.get(newsId) || 0;
}

/**
 * 조회수 상위 ID 목록 반환 (기본 100개)
 */
function getTopViewedIds(limit = 100) {
  const keys = viewCache.keys();
  return keys
    .map(id => ({ id, views: viewCache.get(id) || 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map(item => item.id);
}

/**
 * 뉴스 배열에 조회수를 붙이고 인기순 정렬
 * views가 모두 0이면 최신순 fallback
 */
function sortByPopularity(newsItems) {
  const withViews = newsItems.map(item => ({
    ...item,
    views: getViewCount(item.id),
  }));

  const totalViews = withViews.reduce((s, i) => s + i.views, 0);

  if (totalViews === 0) {
    // 조회수 없으면 최신순 반환
    return withViews;
  }

  return withViews.sort((a, b) => {
    // 조회수 × 100 + 최신성 보너스(24시간 이내 시간 역순)
    const hoursA = (Date.now() - new Date(a.publishedAt)) / 3600000;
    const hoursB = (Date.now() - new Date(b.publishedAt)) / 3600000;
    const scoreA = a.views * 100 + Math.max(0, 48 - hoursA);
    const scoreB = b.views * 100 + Math.max(0, 48 - hoursB);
    return scoreB - scoreA;
  });
}

module.exports = { incrementView, getViewCount, getTopViewedIds, sortByPopularity };
