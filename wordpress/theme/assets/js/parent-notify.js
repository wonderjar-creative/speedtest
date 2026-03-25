// Notify parent comparison app of page navigation
(function () {
  if (window.parent !== window) {
    window.parent.postMessage(
      { type: "navigation", path: window.location.pathname },
      "https://speedtest.denverheadless.com"
    );
  }
})();
