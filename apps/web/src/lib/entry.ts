export function shouldShowSplashOnce(): boolean {
  const k = "akp_seen_splash_v1";
  if (sessionStorage.getItem(k)) return false;
  sessionStorage.setItem(k, "1");
  return true;
}
