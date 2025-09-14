/* ===========================================================
 * Enhanced Service Worker for Jason's Blog v2.0
 * ===========================================================
 * Copyright 2025 @JasonRobertDestiny
 * Licensed under Apache 2.0
 * Advanced PWA features with offline-first strategy
 * ========================================================== */

// Cache configuration
const CACHE_NAMESPACE = 'jason-blog-v2-';
const CACHE_VERSION = '2025.01.14';
const CACHE_NAME = CACHE_NAMESPACE + CACHE_VERSION;

// Cache strategies
const PRECACHE_NAME = CACHE_NAME + '-precache';
const RUNTIME_NAME = CACHE_NAME + '-runtime';
const IMAGE_CACHE = CACHE_NAME + '-images';
const FONT_CACHE = CACHE_NAME + '-fonts';

// Precache resources - critical for offline functionality
const PRECACHE_LIST = [
  "./",
  "./offline.html",
  "./js/jquery.min.js",
  "./js/bootstrap.min.js", 
  "./js/jason-blog.min.js",
  "./js/dark-mode.js",
  "./js/accessibility.js",
  "./js/image-optimization.js",
  "./js/social-share.js",
  "./js/snackbar.js",
  "./js/simple-jason-search.min.js",
  "./css/jason-blog.min.css",
  "./css/bootstrap.min.css",
  "./img/favicon.ico",
  "./img/home-bg.jpg",
  "./img/404-bg.jpg",
  "./pwa/manifest.json"
];

// Runtime cache configurations
const CACHE_STRATEGIES = {
  pages: {
    cacheName: RUNTIME_NAME,
    strategy: 'NetworkFirst',
    maxAgeSeconds: 24 * 60 * 60, // 24 hours
    maxEntries: 50
  },
  images: {
    cacheName: IMAGE_CACHE,
    strategy: 'CacheFirst', 
    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
    maxEntries: 100
  },
  fonts: {
    cacheName: FONT_CACHE,
    strategy: 'CacheFirst',
    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
    maxEntries: 20
  },
  api: {
    cacheName: RUNTIME_NAME,
    strategy: 'NetworkFirst',
    maxAgeSeconds: 5 * 60, // 5 minutes
    maxEntries: 20
  }
};

const HOSTNAME_WHITELIST = [
  self.location.hostname,
  "jasonrobertdestiny.github.io",
  "cdnjs.cloudflare.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com"
];

// Install event - precache critical resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(PRECACHE_NAME)
      .then(cache => {
        console.log('Precaching resources...');
        return cache.addAll(PRECACHE_LIST);
      })
      .then(() => {
        console.log('Precache completed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Precache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith(CACHE_NAMESPACE) && 
              !cacheName.includes(CACHE_VERSION)
            )
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
  
  console.log('Service Worker activated');
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Only handle whitelisted hostnames
  if (HOSTNAME_WHITELIST.indexOf(url.hostname) === -1) {
    return;
  }
  
  // Determine caching strategy based on request type
  if (isHTMLRequest(request)) {
    event.respondWith(handlePageRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isFontRequest(request)) {
    event.respondWith(handleFontRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAssetRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// Request type detection
function isHTMLRequest(request) {
  return request.destination === 'document' || 
         (request.headers.get('accept') && request.headers.get('accept').includes('text/html'));
}

function isImageRequest(request) {
  return request.destination === 'image' ||
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(new URL(request.url).pathname);
}

function isFontRequest(request) {
  return request.destination === 'font' ||
         /\.(woff|woff2|ttf|eot)$/i.test(new URL(request.url).pathname);
}

function isStaticAsset(request) {
  return /\.(css|js|json)$/i.test(new URL(request.url).pathname);
}

// Caching strategy implementations
async function handlePageRequest(request) {
  try {
    // Network First strategy for pages
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_STRATEGIES.pages.cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for page, trying cache...');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('./offline.html');
  }
}

async function handleImageRequest(request) {
  // Cache First strategy for images
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_STRATEGIES.images.cacheName);
      cache.put(request, networkResponse.clone());
      
      // Cleanup old entries
      await cleanupCache(CACHE_STRATEGIES.images);
    }
    return networkResponse;
  } catch (error) {
    console.log('Failed to load image:', request.url);
    // Return placeholder image or let it fail
    return new Response('', { status: 404 });
  }
}

async function handleFontRequest(request) {
  // Cache First strategy for fonts
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_STRATEGIES.fonts.cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Failed to load font:', request.url);
    return new Response('', { status: 404 });
  }
}

async function handleStaticAssetRequest(request) {
  // Stale While Revalidate for CSS/JS
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(RUNTIME_NAME);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

async function handleGenericRequest(request) {
  // Network First fallback
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Cache cleanup utility
async function cleanupCache(strategy) {
  const cache = await caches.open(strategy.cacheName);
  const requests = await cache.keys();
  
  if (requests.length > strategy.maxEntries) {
    const sortedRequests = requests.sort((a, b) => {
      // Sort by last accessed (approximation)
      return new URL(a.url).searchParams.get('t') - new URL(b.url).searchParams.get('t');
    });
    
    const toDelete = sortedRequests.slice(0, requests.length - strategy.maxEntries);
    await Promise.all(toDelete.map(request => cache.delete(request)));
  }
}

// Message handling for client communication
self.addEventListener('message', event => {
  const { data } = event;
  
  switch (data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'PRECACHE_UPDATE':
      updatePrecache().then(() => {
        event.ports[0].postMessage({ updated: true });
      });
      break;
  }
});

// Utility functions
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    status[cacheName] = requests.length;
  }
  
  return status;
}

async function clearCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames
      .filter(name => name.startsWith(CACHE_NAMESPACE))
      .map(name => caches.delete(name))
  );
}

async function updatePrecache() {
  const cache = await caches.open(PRECACHE_NAME);
  return cache.addAll(PRECACHE_LIST);
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline form submissions, analytics, etc.
  console.log('Performing background sync...');
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('Push notification received:', event);
  
  const options = {
    body: 'Jason的博客有新内容更新！',
    icon: './img/favicon.ico',
    badge: './img/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: '查看更新',
        icon: './img/favicon.ico'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Jason\'s Blog', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.matchAll().then(clientsList => {
        if (clientsList.length > 0) {
          return clientsList[0].focus();
        }
        return clients.openWindow('./');
      })
    );
  }
});

console.log('Enhanced Service Worker loaded successfully');