export default async function loadGAScript(config) {
  const { sampleRUM, gaId, webworker } = config;
  // Listen to changes in consent
  sampleRUM.always.on('consent', ({ source, target }) => {
    if (source === 'ANALYTICS' && target) {
      if (window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: target === 'ALLOW' ? 'granted' : 'denied',
        });
      }
    }
  });

  const scriptGA = document.createElement('script');
  scriptGA.src = `//www.googletagmanager.com/gtag/js?id=${gaId}`;
  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
// Google Analytics
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gaId}');
`;
  if (webworker && webworker.toLowerCase() === 'yes') {
    scriptGA.type = 'text/partytown';
    scriptTag.type = 'text/partytown';
  }
  document.head.prepend(scriptGA);
  document.head.prepend(scriptTag);
}


// Listen to changes in consent
sampleRUM.always.on('consent', ({ source, target }) => {
  if (source === 'ANALYTICS' && target) {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: target == 'ALLOW' ? 'granted' : 'denied',
      });
    }
  }
});