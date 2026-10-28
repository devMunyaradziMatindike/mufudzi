export function closeOverlay() {
  history.pushState(null, "", `${location.pathname}${location.search}`);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
