// ── 캐시 버전 (배포 때마다 올려주면 구버전 자동 삭제) ──────────────────────
const CACHE_VERSION = 'v2';
const STATIC_CACHE  = `daily-news-static-${CACHE_VERSION}`;
const NEWS_CACHE    = `daily-news-news-${CACHE_VERSION}`;
const IMAGE_CACHE   = `daily-news-images-${CACHE_VERSION}`;

// ── 항상 캐싱할 정적 자산 ──────────────────────────────────────────────────
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── 설치: 정적 자산 사전 캐싱 ─────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── 활성화: 구버전 캐시 정리 ───────────────────────────────────────────────
self.addEventListener('activate', event => {
  const validCaches = [STATIC_CACHE, NEWS_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !validCaches.includes(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch 전략 ─────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // POST 등 GET이 아닌 요청은 네트워크 그대로 통과
  if (request.method !== 'GET') return;

  // ── 1. API 요청: Network First (최신 뉴스 우선, 실패 시 캐시) ─────────────
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(NEWS_CACHE).then(cache => {
              cache.put(request, clone);
              // 뉴스 캐시는 최대 30개 유지
              trimCache(NEWS_CACHE, 30);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // ── 2. 이미지: Cache First (이미지는 자주 안 바뀜, 최대 60개) ────────────
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request)
          .then(response => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(IMAGE_CACHE).then(cache => {
                cache.put(request, clone);
                trimCache(IMAGE_CACHE, 60);
              });
            }
            return response;
          })
          .catch(() => caches.match('/icons/icon-192.png'));
      })
    );
    return;
  }

  // ── 3. 정적 자산 (JS/CSS/HTML): Stale While Revalidate ───────────────────
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(STATIC_CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      });
      // 캐시가 있으면 즉시 응답, 백그라운드에서 갱신
      return cached || fetchPromise;
    })
  );
});

// ── 캐시 크기 제한 (오래된 항목 삭제) ─────────────────────────────────────
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys  = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
  }
}

// ── 푸시 알림 (추후 확장용) ───────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || '데일리 뉴스', {
      body:    data.body || '새 뉴스가 있습니다.',
      icon:    '/icons/icon-192.png',
      badge:   '/icons/icon-72.png',
      data:    { url: data.url || '/' },
      vibrate: [100, 50, 100],
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
