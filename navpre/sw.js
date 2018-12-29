const log = msg => console.log(`[sw.js] ${msg}`);

this.addEventListener('fetch', fetchEvent => {
  fetchEvent.respondWith(async function() {
    log('got fetch event for url: ' + fetchEvent.request.url);

    const preloadResponse = await fetchEvent.preloadResponse;
    if (preloadResponse) {
      log('got preloadResponse, returning it');
      return preloadResponse;
    }

    log('no preloadResponse, forwarding fetch for url: '
      + fetchEvent.request.url);
    return fetch(fetchEvent.request);
  }());
});

this.addEventListener('activate', activateEvent => {
  activateEvent.waitUntil(async function() {
    log('calling navigationPreload.enable()...');
    await self.registration.navigationPreload.enable();
    log('finished navigationPreload.enable()');
  }());
});
