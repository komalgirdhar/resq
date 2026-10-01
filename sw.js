// Minimal Service Worker just to trigger PWA installation

self.addEventListener('install', (event) => {
    console.log('Service Worker installed.');
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
});

// MANDATORY: A fetch event listener is required by browsers to show the "Install" prompt.
// We are leaving it empty so it just passes the normal internet connection through 
// without saving/caching any files offline.
self.addEventListener('fetch', (event) => {
    // Empty fetch handler - does nothing but satisfy PWA criteria.
    return;
});