importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

function matchFunction({ url }) {
  const pages = ['/', '/tips/focus', '/tips/anti-stress', '/tips/relax', '/tips/alert', '/tips/meditate'];
  return pages.includes(url.pathname);
}

workbox.routing.registerRoute(
  matchFunction,
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-cache'
  })
);

workbox.routing.registerRoute(
  new RegExp('.+/assets/.+'),
  new workbox.strategies.CacheFirst({
    cacheName: "assets"
  })
);

workbox.routing.registerRoute(
  new RegExp('.+/css/.+'),
  new workbox.strategies.CacheFirst({
    cacheName: "css"
  })
);

workbox.routing.registerRoute(
  new RegExp('.+/fonts/.+'),
  new workbox.strategies.CacheFirst({
    cacheName: "fonts"
  })
);

workbox.routing.registerRoute(
  new RegExp('.+/images/.+'),
  new workbox.strategies.CacheFirst({
    cacheName: "images"
  })
);

workbox.routing.registerRoute(
  new RegExp('.+/js/.+'),
  new workbox.strategies.CacheFirst({
    cacheName: "js"
  })
);

workbox.routing.registerRoute(
  /\.json$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "settings"
  })
)