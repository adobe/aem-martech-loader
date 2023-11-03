export default function loadGTMScript(config) {
  const { gtmId, webworker, sampleRUM } = config;
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
  const scriptTag = document.createElement('script');
  scriptTag.innerHTML = `
  // googleTagManager
  (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
          'gtm.start':
              new Date().getTime(), event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src =
          'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', '${gtmId}');
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('set', {
      'cookie_flags': 'SameSite=None;Secure'
  });
  `;
  if (webworker && webworker.toLowerCase() === 'yes') {
    scriptTag.type = 'text/partytown';
  }
  document.head.prepend(scriptTag);
}
