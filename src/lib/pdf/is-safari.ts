/** True for Safari on macOS/iOS (not Chrome, Firefox, or Edge on Apple platforms). */
export function isSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isWebKit = /AppleWebKit/i.test(ua);
  const isOtherBrowser = /Chrome|CriOS|Chromium|Edg|EdgiOS|FxiOS|OPR/i.test(ua);
  return isWebKit && !isOtherBrowser;
}
