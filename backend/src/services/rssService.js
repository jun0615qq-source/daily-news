const Parser = require('rss-parser');
const NodeCache = require('node-cache');
const { summarize, extractImage, stripHtml } = require('./summarizer');

const parser = new Parser({
  customFields: {
    item: [
      ['media:content',    'media:content',    { keepArray: true }],
      ['media:thumbnail',  'media:thumbnail',  { keepArray: true }], // BBC: 여러 해상도 제공
      ['media:group',      'media:group'],
      ['content:encoded',  'content:encoded'],
      ['enclosure',        'enclosure'],
    ],
  },
  timeout: 12000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; DailyNewsBot/1.0; +https://dailynews.app)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
});

// ── 캐시 (TTL = 5분) ─────────────────────────────────────────────────────────
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 300 });

// ── 카테고리별 한글 이름 ──────────────────────────────────────────────────────
const CATEGORY_NAMES = {
  all:           '전체',
  popular:       '인기뉴스',
  domestic:      '국내',
  international: '국제',
  politics:      '정치',
  economy:       '경제',
  society:       '사회',
  it:            'IT/과학',
  sports:        '스포츠',
  entertainment: '연예',
  health:        '건강',
};

// 국내 카테고리에 포함되는 분야
const DOMESTIC_CATEGORIES = ['politics', 'economy', 'society', 'it', 'sports', 'entertainment', 'health'];
// 국제 카테고리에 포함되는 분야
const INTERNATIONAL_CATEGORIES = ['international'];

// ── 카테고리별 기본 이미지 ────────────────────────────────────────────────────
const CATEGORY_IMAGES = {
  politics:      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80',
  economy:       'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
  society:       'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
  international: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
  it:            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  sports:        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
  entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
  health:        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80',
};

// ── 키워드 기반 자동 카테고리 분류 ───────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  politics: [
    '정치','대통령','국회','여당','야당','정부','법안','선거','의원','장관',
    '청와대','총리','의회','국정','여론','민주당','국민의힘','탄핵','개헌',
    'politics','government','parliament','election','senate','congress',
  ],
  economy: [
    '경제','주식','금리','물가','환율','기업','시장','투자','증권','GDP',
    '무역','수출','수입','금융','코스피','코스닥','부동산','세금','예산',
    '인플레','달러','원화','채권','펀드','적자','흑자','성장률',
    'economy','stock','market','finance','trade','inflation','gdp',
  ],
  society: [
    '사회','사건','사고','범죄','교육','복지','노동','환경','인권','재난',
    '화재','교통','시위','집회','학교','대학','취업','실업','빈곤',
    'society','crime','education','welfare','accident','fire',
  ],
  international: [
    '국제','외교','미국','중국','일본','러시아','유럽','전쟁','분쟁','UN',
    '나토','바이든','시진핑','우크라이나','북한','핵','제재','동맹','조약',
    'world','international','global','war','diplomacy','ukraine','nato',
  ],
  it: [
    'IT','기술','인공지능','AI','스마트폰','반도체','소프트웨어','앱','데이터',
    '클라우드','메타버스','블록체인','코딩','해킹','사이버','삼성전자','SK하이닉스',
    '구글','애플','마이크로소프트','오픈AI','챗GPT','테슬라',
    'tech','technology','software','hardware','ai','robot','cyber','chip',
  ],
  sports: [
    '스포츠','축구','야구','농구','테니스','배구','골프','수영','육상',
    '올림픽','월드컵','선수','감독','득점','승리','패배','우승','리그',
    'sports','football','baseball','basketball','tennis','olympic','soccer',
  ],
  entertainment: [
    '연예','드라마','영화','음악','아이돌','배우','가수','콘서트','방송',
    '예능','웹툰','넷플릭스','OTT','BTS','블랙핑크','뮤지컬','시상식',
    'entertainment','movie','music','actor','singer','concert','drama',
  ],
  health: [
    '건강','의료','병원','치료','질병','코로나','백신','약','운동','다이어트',
    '암','당뇨','고혈압','정신건강','수면','영양','의약품','임상',
    'health','medical','hospital','vaccine','disease','treatment','diet',
  ],
};

/**
 * 제목 + 설명 텍스트를 키워드로 분석해 가장 적합한 카테고리를 반환합니다.
 * 일치하는 키워드가 없으면 feedCategory(피드 기본 카테고리)를 그대로 사용합니다.
 */
function detectCategory(title = '', description = '', feedCategory = 'society') {
  const text = `${title} ${description}`.toLowerCase();
  let best = feedCategory;
  let maxScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((s, kw) => s + (text.includes(kw.toLowerCase()) ? 1 : 0), 0);
    if (score > maxScore) {
      maxScore = score;
      best = cat;
    }
  }
  // 다른 카테고리가 3개 이상 일치하고 피드 카테고리보다 점수가 2배 이상일 때만 재분류
  // → 정치 기사에 경제 단어가 1~2개 있어도 정치로 유지
  const feedScore = CATEGORY_KEYWORDS[feedCategory]
    ? CATEGORY_KEYWORDS[feedCategory].reduce((s, kw) => s + (text.includes(kw.toLowerCase()) ? 1 : 0), 0)
    : 0;

  if (best !== feedCategory && maxScore >= 3 && maxScore >= feedScore * 2) {
    return best;
  }
  return feedCategory;
}

// ── 전체 RSS 피드 목록 (region 추가: domestic / international) ───────────────
const ALL_FEEDS = [
  // 정치 (국내)
  { url: 'https://rss.donga.com/politics.xml',   source: '동아일보', feedCategory: 'politics', region: 'domestic' },
  // 경제 (국내 + 국제)
  { url: 'https://rss.donga.com/economy.xml',    source: '동아일보', feedCategory: 'economy',  region: 'domestic' },
  { url: 'https://www.hankyung.com/feed/economy', source: '한국경제', feedCategory: 'economy',  region: 'domestic' },
  { url: 'https://feeds.reuters.com/reuters/businessNews', source: 'Reuters', feedCategory: 'economy', region: 'international' },
  // 사회 (국내)
  { url: 'https://rss.donga.com/national.xml',   source: '동아일보', feedCategory: 'society',  region: 'domestic' },
  // 국제
  { url: 'https://rss.donga.com/international.xml',    source: '동아일보',  feedCategory: 'international', region: 'international' },
  { url: 'http://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World', feedCategory: 'international', region: 'international' },
  { url: 'https://feeds.reuters.com/reuters/topNews',  source: 'Reuters',   feedCategory: 'international', region: 'international' },
  // IT/과학 (국내 + 국제)
  { url: 'https://www.etnews.com/rss/section/ET01.xml', source: '전자신문',  feedCategory: 'it', region: 'domestic' },
  { url: 'https://techcrunch.com/feed/',               source: 'TechCrunch', feedCategory: 'it', region: 'international' },
  { url: 'https://www.theverge.com/rss/index.xml',     source: 'The Verge',  feedCategory: 'it', region: 'international' },
  // 스포츠 (국내 + 국제)
  { url: 'https://rss.donga.com/sports.xml',      source: '동아일보', feedCategory: 'sports', region: 'domestic' },
  { url: 'http://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport', feedCategory: 'sports', region: 'international' },
  // 연예 (국내)
  { url: 'https://rss.donga.com/culture.xml', source: '동아일보', feedCategory: 'entertainment', region: 'domestic' },
  // 건강 (국내 + 국제)
  { url: 'https://rss.donga.com/health.xml',            source: '동아일보',  feedCategory: 'health', region: 'domestic' },
  { url: 'http://feeds.bbci.co.uk/news/health/rss.xml', source: 'BBC Health', feedCategory: 'health', region: 'international' },
];

/**
 * RSS 아이템 하나를 뉴스 객체로 변환합니다.
 */
function toNewsItem(item, source, feedCategory, region = 'domestic') {
  const rawText   = stripHtml(item['content:encoded'] || item.content || '');
  const desc      = stripHtml(item.contentSnippet || item.description || '');
  const textForAI = rawText || desc;

  // 키워드 기반 카테고리 재분류
  const category = detectCategory(item.title || '', textForAI, feedCategory);

  return {
    id:           Buffer.from((item.link || item.guid || item.title || '').toString())
                    .toString('base64').replace(/[^A-Za-z0-9]/g, '').slice(0, 32),
    title:        (item.title || '제목 없음').trim(),
    summary:      summarize(textForAI, 3) || desc.slice(0, 200),
    description:  desc.slice(0, 300),
    source,
    sourceUrl:    item.link || '#',
    image:        extractImage(item) || CATEGORY_IMAGES[category] || null,
    category,
    categoryName: CATEGORY_NAMES[category] || category,
    region,                        // 'domestic' | 'international'
    publishedAt:  item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    author:       item.creator || item.author || source,
  };
}

/**
 * 단일 RSS 피드를 파싱합니다.
 */
async function parseFeed({ url, source, feedCategory, region }) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.slice(0, 15).map(item => toNewsItem(item, source, feedCategory, region));
  } catch (err) {
    console.warn(`[RSS] 파싱 실패 (${source}): ${err.message}`);
    return [];
  }
}

/**
 * 전체 RSS 피드를 수집해 중복 제거 후 캐싱합니다. (마스터 풀)
 * getAllNews / getNewsByCategory 모두 이 풀에서 가져옵니다.
 */
async function fetchMasterPool() {
  const cacheKey = 'master_pool';
  const cached   = cache.get(cacheKey);
  if (cached) return cached;

  console.log('[RSS] 전체 피드 수집 시작...');
  const results = await Promise.allSettled(ALL_FEEDS.map(f => parseFeed(f)));

  const items = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // 제목 앞 30글자 기준 중복 제거
  const seen   = new Set();
  const unique = items.filter(item => {
    const key = item.title.slice(0, 30).toLowerCase().replace(/\s/g, '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  cache.set(cacheKey, unique);
  console.log(`[RSS] 수집 완료: ${unique.length}개 기사`);
  return unique;
}

/**
 * 전체 뉴스 반환 (카테고리 무관)
 */
async function getAllNews(limit = 30) {
  const pool = await fetchMasterPool();
  return pool.slice(0, limit);
}

/**
 * 특정 카테고리 뉴스 반환 — 마스터 풀을 카테고리로 필터링
 */
async function getNewsByCategory(category) {
  const cacheKey = `news_${category}`;
  const cached   = cache.get(cacheKey);
  if (cached) return cached;

  const pool     = await fetchMasterPool();
  const filtered = pool.filter(item => item.category === category);

  cache.set(cacheKey, filtered);
  console.log(`[RSS] 카테고리 '${category}': ${filtered.length}개 기사`);
  return filtered;
}

/** 전체 캐시 초기화 (서버 재시작 없이 새 피드 강제 수집) */
function clearCache() {
  cache.flushAll();
  console.log('[RSS] 캐시 초기화 완료');
}

module.exports = {
  getNewsByCategory,
  getAllNews,
  fetchMasterPool,
  clearCache,
  CATEGORY_NAMES,
  DOMESTIC_CATEGORIES,
  INTERNATIONAL_CATEGORIES,
  ALL_FEEDS,
};
