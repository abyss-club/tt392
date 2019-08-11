if (typeof importScripts === 'function') {
  /* eslint-disable-next-line no-undef */
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js',
  );
  /* global workbox */
  if (workbox) {
    // console.log('Workbox is loaded');

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([]);

    /* custom cache rules */
    workbox.routing.registerNavigationRoute('/index.html', {
      blacklist: [/^\/_/, /\/[^/]+\.[^/]+$/],
    });

    workbox.routing.registerRoute(
      new RegExp('.*/graphql$'),
      new workbox.strategies.NetworkOnly(),
      'POST',
    );

    workbox.routing.registerRoute(
      /\.(?:png|svg|woff2?)$/,
      workbox.strategies.cacheFirst({
        cacheName: 'assets',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          }),
        ],
      }),
    );

    workbox.routing.setDefaultHandler(
      new workbox.strategies.StaleWhileRevalidate(),
    );
  } else {
    // console.log('Workbox could not be loaded. No Offline support');
  }
}
