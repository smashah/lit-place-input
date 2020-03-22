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
    "revision": "8474b06488126ed75a9568c672822e6d"
  },
  {
    "url": "index.html",
    "revision": "22093a95cfe3140fe786392d467877d6"
  },
  {
    "url": "inline-entry.0-03d5ee9a.js",
    "revision": "3d7f110bed905b287dc0bc3fd279c0b7"
  },
  {
    "url": "inline-entry.0-73eedab9.js",
    "revision": "90a64e3eab38a019c8669513dc1fb57b"
  },
  {
    "url": "legacy/inline-entry.0-7fb3b0e2.js",
    "revision": "17def4feacf605bdfac4e0d107d1f742"
  },
  {
    "url": "legacy/inline-entry.0-a41534b5.js",
    "revision": "72c77d1cf9533e745c279f68677a9207"
  },
  {
    "url": "legacy/lit-html-1993744d.js",
    "revision": "5b24395930e1093a56bef7177cc33da0"
  },
  {
    "url": "legacy/storybook-70f8dff1.js",
    "revision": "29bf771ceac2eb94dafa3f57d300860d"
  },
  {
    "url": "legacy/storybook-9dc97b03.js",
    "revision": "4ce411166d788b9bf9b568cd6cf62990"
  },
  {
    "url": "lit-html-1efc25e7.js",
    "revision": "39dcaa708d612cda68ad4608ba264f7b"
  },
  {
    "url": "polyfills/core-js.577a5602a7262d6256830802d4aaab43.js",
    "revision": "ccf205728fe514f8276191669b5ea48d"
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
    "url": "polyfills/regenerator-runtime.9090ed1c23690e3072c21a7873cad285.js",
    "revision": "9af9d9e480dfccc420d30729e319b821"
  },
  {
    "url": "polyfills/systemjs.6dfbfd8f2c3e558918ed74d133a6757a.js",
    "revision": "683aabfb9b006607885b83e45e9a1768"
  },
  {
    "url": "polyfills/webcomponents.6954abecfe8b165751e6bc9b0af6c639.js",
    "revision": "894a294495257c3d389efa3e1bd9bde7"
  },
  {
    "url": "storybook-047c6a44.js",
    "revision": "f1ea9af9325554b34848b6b591f2dddf"
  },
  {
    "url": "storybook-41472cde.js",
    "revision": "a9b332b8e8bb8da5a15e62f479523de1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"));
