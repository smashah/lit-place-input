/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "iframe.html",
    "revision": "10f4a83ffee3a6adf9a71bd3bbeb85e1"
  },
  {
    "url": "index.html",
    "revision": "a26cd4fb2ec9e032248d2bc0ef7c314f"
  },
  {
    "url": "index.stories-fd9edc96.js",
    "revision": "c121c1bc90256afa3446797a61000774"
  },
  {
    "url": "inline-entry.0-14c68850.js",
    "revision": "f28464c80c6edabf25eb3e7494514dcc"
  },
  {
    "url": "legacy/index.stories-e19816f4.js",
    "revision": "9e540e25ebbf4a13ac42848b350034e2"
  },
  {
    "url": "legacy/inline-entry.0-00c5f6db.js",
    "revision": "f04a66c9a670bffb7668fb9faa6b7659"
  },
  {
    "url": "legacy/preview-085bfa4d.js",
    "revision": "f7a2793be1322956baec1534668dbe3f"
  },
  {
    "url": "polyfills/core-js.4c7c9c2566cbb271da3d503eac696712.js",
    "revision": "588c9fd0041f86331d93cc46fa748c1f"
  },
  {
    "url": "polyfills/custom-elements-es5-adapter.84b300ee818dce8b351c7cc7c100bcf7.js",
    "revision": "cff507bc95ad1d6bf1a415cc9c8852b0"
  },
  {
    "url": "polyfills/dynamic-import.b745cfc9384367cc18b42bbef2bbdcd9.js",
    "revision": "ed55766050be285197b8f511eacedb62"
  },
  {
    "url": "polyfills/fetch.191258a74d74243758f52065f3d0962a.js",
    "revision": "fcdc4efda1fe1b52f814e36273ff745d"
  },
  {
    "url": "polyfills/regenerator-runtime.92d44da139046113cb3739b173605787.js",
    "revision": "3aa324bcf8f59cd0eebf46796948aafa"
  },
  {
    "url": "polyfills/systemjs.6dfbfd8f2c3e558918ed74d133a6757a.js",
    "revision": "683aabfb9b006607885b83e45e9a1768"
  },
  {
    "url": "polyfills/webcomponents.dae9f79d9d6992b6582e204c3dd953d3.js",
    "revision": "fe4a22f36087db029cd3f476a1935410"
  },
  {
    "url": "preview-0c960fe8.js",
    "revision": "cccc808a04d9107408d6c62f682355f2"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
