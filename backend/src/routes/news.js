const express = require('express');
const { query, param, validationResult } = require('express-validator');
const { newsLimiter } = require('../middleware/security');
const {
  getNewsByCategory,
  getAllNews,
  fetchMasterPool,
  clearCache,
  CATEGORY_NAMES,
  DOMESTIC_CATEGORIES,
  INTERNATIONAL_CATEGORIES,
} = require('../services/rssService');
const { incrementView, sortByPopularity } = require('../services/viewService');

const router = express.Router();

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

// ── POST /api/news/refresh — 캐시 강제 초기화 (개발/관리용) ─────────────────
router.post('/refresh', (req, res) => {
  clearCache();
  res.json({ message: '캐시가 초기화되었습니다. 다음 요청 시 피드를 새로 수집합니다.' });
});

// ── GET /api/news/categories ──────────────────────────────────────────────────
router.get('/categories', (req, res) => {
  // 카테고리를 그룹으로 구분해서 반환
  res.json({
    categories: [
      // 특별 카테고리
      { id: 'all',     name: '전체',    group: 'special' },
      { id: 'popular', name: '인기뉴스', group: 'special' },
      // 지역 범주
      { id: 'domestic',      name: '국내', group: 'region' },
      { id: 'international', name: '국제', group: 'region' },
      // 분야별
      { id: 'politics',      name: '정치',    group: 'topic' },
      { id: 'economy',       name: '경제',    group: 'topic' },
      { id: 'society',       name: '사회',    group: 'topic' },
      { id: 'it',            name: 'IT/과학', group: 'topic' },
      { id: 'sports',        name: '스포츠',  group: 'topic' },
      { id: 'entertainment', name: '연예',    group: 'topic' },
      { id: 'health',        name: '건강',    group: 'topic' },
    ],
  });
});

// ── POST /api/news/:id/view — 조회수 증가 ─────────────────────────────────────
router.post(
  '/:id/view',
  [param('id').isString().trim().isLength({ min: 1, max: 64 })],
  validate,
  (req, res) => {
    const views = incrementView(req.params.id);
    res.json({ views });
  }
);

// ── GET /api/news?category=all&page=1&limit=12 ────────────────────────────────
router.get(
  '/',
  newsLimiter,
  [
    query('category').optional().isString().trim().isLength({ max: 30 }),
    query('page').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const category = req.query.category || 'all';
      const page     = req.query.page  || 1;
      const limit    = req.query.limit || 12;

      const validCategories = Object.keys(CATEGORY_NAMES);
      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: '유효하지 않은 카테고리입니다.' });
      }

      let news;

      if (category === 'all') {
        // 전체: 최신순 100개
        news = await getAllNews(100);

      } else if (category === 'popular') {
        // 인기뉴스: 마스터 풀 전체를 조회수 기준 정렬
        const pool = await fetchMasterPool();
        news = sortByPopularity(pool).slice(0, 100);

      } else if (category === 'domestic') {
        // 국내: 국내 출처 기사 (region === 'domestic')
        const pool = await fetchMasterPool();
        news = pool.filter(item => item.region === 'domestic');

      } else if (category === 'international') {
        // 국제: 국제 출처 기사 (region === 'international') 또는 국제 카테고리
        const pool = await fetchMasterPool();
        news = pool.filter(
          item => item.region === 'international' || item.category === 'international'
        );

      } else {
        // 분야별 (politics, economy 등)
        news = await getNewsByCategory(category);
      }

      const start     = (page - 1) * limit;
      const paginated = news.slice(start, start + limit);

      res.json({
        news:       paginated,
        total:      news.length,
        page,
        totalPages: Math.ceil(news.length / limit),
        category,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
