// apps/web/src/lib/ensureRecaptchaContainer.ts
export function ensureRecaptchaContainer() {
  if (typeof window === "undefined") return;
  let el = document.getElementById("recaptcha-container");
  if (!el) {
    el = document.createElement("div");
    el.id = "recaptcha-container";
    el.style.display = "none";
    document.body.appendChild(el);
  }
}
