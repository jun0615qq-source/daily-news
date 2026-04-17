const rateLimit = require('express-rate-limit');

// ── 일반 API Rate Limit (IP당 15분에 100회) ───────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
  skip: (req) => process.env.NODE_ENV === 'test',
});

// ── 뉴스 피드 전용 Rate Limit (IP당 1분에 30회) ───────────────────────────────
const newsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: '뉴스 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
});

module.exports = { apiLimiter, newsLimiter };
