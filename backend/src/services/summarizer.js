const cheerio = require('cheerio');

/**
 * HTML 태그를 제거하고 순수 텍스트를 반환합니다.
 */
function stripHtml(html = '') {
  const $ = cheerio.load(html);
  return $.text().replace(/\s+/g, ' ').trim();
}

/**
 * 텍스트를 문장 단위로 분리합니다. (한국어/영어 모두 지원)
 */
function splitSentences(text) {
  // 마침표, 물음표, 느낌표 뒤 공백 기준으로 분리
  return text.match(/[^.!?\n]+[.!?\n]+/g)?.map(s => s.trim()).filter(s => s.length > 20) || [text];
}

/**
 * TF 기반 단순 추출 요약 (무료, API 불필요)
 * @param {string} text - 요약할 원문 텍스트
 * @param {number} numSentences - 반환할 문장 수
 * @returns {string} 요약문
 */
function summarize(text, numSentences = 3) {
  const clean = stripHtml(text);
  if (!clean || clean.length < 100) return clean;

  const sentences = splitSentences(clean);
  if (sentences.length <= numSentences) return clean.slice(0, 300) + (clean.length > 300 ? '...' : '');

  // 단어 빈도 계산 (불용어 제외)
  const stopWords = new Set([
    '이', '그', '저', '것', '수', '있', '하', '을', '를', '이', '가', '은', '는',
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for',
    'of', 'and', 'or', 'but', 'with', 'by', 'from', 'this', 'that',
  ]);

  const allWords = clean.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  const wordFreq = {};
  allWords.forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1; });

  // 문장별 점수 계산
  const scored = sentences.map((sent, index) => {
    const words = sent.toLowerCase().split(/\s+/).filter(w => !stopWords.has(w));
    const score = words.length > 0
      ? words.reduce((sum, w) => sum + (wordFreq[w] || 0), 0) / words.length
      : 0;
    return { sent, score, index };
  });

  // 상위 문장 선택 후 원문 순서 복원
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, numSentences)
    .sort((a, b) => a.index - b.index)
    .map(s => s.sent.trim())
    .join(' ');
}

/** http(s)로 시작하는 유효한 URL인지 확인 */
function isHttpUrl(url) {
  return typeof url === 'string' && /^https?:\/\/.+/.test(url.trim());
}

/**
 * RSS 아이템에서 이미지 URL을 추출합니다.
 *
 * 소스별 이미지 필드 위치:
 *   BBC         → media:thumbnail.$. url
 *   Reuters     → media:content[].$.url  또는  enclosure.url
 *   TechCrunch  → media:content[].$.url
 *   The Verge   → media:content[].$.url
 *   동아/한경   → content:encoded 안의 <img>
 */
function extractImage(item) {
  try {
    // ── 1. media:thumbnail (BBC 전용 필드 — 여러 해상도 중 가장 큰 것 선택) ─
    const thumb = item['media:thumbnail'];
    if (thumb) {
      const arr = Array.isArray(thumb) ? thumb : [thumb];
      // width 기준 내림차순 정렬 → 가장 큰 이미지 선택
      const sorted = arr
        .map(t => ({ url: t?.['$']?.url || t?.url, w: parseInt(t?.['$']?.width || '0') }))
        .filter(t => isHttpUrl(t.url))
        .sort((a, b) => b.w - a.w);
      if (sorted.length > 0) return sorted[0].url.trim();
    }

    // ── 2. media:content (Reuters, TechCrunch, The Verge 등) ───────────────
    const mc = item['media:content'];
    if (mc) {
      const arr = Array.isArray(mc) ? mc : [mc];
      // 이미지 medium 우선, 없으면 첫 번째 url
      const imageItem = arr.find(m => m?.['$']?.medium === 'image') || arr[0];
      const url = imageItem?.['$']?.url || imageItem?.url;
      if (isHttpUrl(url)) return url.trim();
    }

    // ── 3. enclosure (팟캐스트·일부 피드, 확장자 무관 허용) ────────────────
    if (isHttpUrl(item.enclosure?.url)) {
      const u = item.enclosure.url.trim();
      // 오디오 파일은 제외
      if (!/\.(mp3|mp4|m4a|ogg|wav|aac)(\?|$)/i.test(u)) return u;
    }

    // ── 4. content:encoded / content / description 안의 첫 번째 <img> ──────
    const html = item['content:encoded'] || item.content || item.description || '';
    if (html) {
      const $ = cheerio.load(html);
      const imgEl = $('img').first();

      // src, data-src, data-lazy-src 순서로 시도
      const src = imgEl.attr('src')
        || imgEl.attr('data-src')
        || imgEl.attr('data-lazy-src')
        || imgEl.attr('data-original');

      if (isHttpUrl(src)) return src.trim();

      // srcset에서 첫 번째 URL 추출
      const srcset = imgEl.attr('srcset');
      if (srcset) {
        const first = srcset.split(',')[0].trim().split(/\s+/)[0];
        if (isHttpUrl(first)) return first;
      }
    }

    // ── 5. 피드 레벨 image (일부 RSS 피드) ───────────────────────────────
    const feedImg = item.image?.url || item.image;
    if (isHttpUrl(feedImg)) return feedImg.trim();

  } catch (_) {}

  return null;
}

module.exports = { summarize, extractImage, stripHtml };
