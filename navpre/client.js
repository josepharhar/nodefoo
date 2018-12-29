const log = msg => console.log(`[client.js] ${msg}`);

window.onload = async function() {
  log('henlo');
  
  const registration = await navigator.serviceWorker.register('/sw.js');
  const navPreState = await registration.navigationPreload.getState();
  log('navigationPreload.getState(): '
    + JSON.stringify(navPreState, null, 2));
}
