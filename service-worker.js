importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');
function matchFunction({ url }) {
  const pages = ['/', '/tips/focus', '/tips/anti-stress', '/tips/relax', '/tips/alert', '/tips/meditate'];
  return pages.includes(url.pathname);
}

workbox.routing.registerRoute(
  matchFunction,
  new workbox.strategies.CacheFirst({
    cacheName: 'html-cache'
  })
);

// workbox.routing.registerRoute(
//   /\.(?:css|js)$/,
//   new workbox.strategies.StaleWhileRevalidate({
//     cacheName: "assets"
//   })
// );

workbox.routing.registerRoute(
  /\.(?:ico|png|webp)$/,
  new workbox.strategies.CacheFirst({
    cacheName: "images"
  })
)