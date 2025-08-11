export const TZ_ISO = "TZ";
export const TZ_CC = "+255";

export function normalizeTZ(input: string): { e164: string; local: string } {
  let n = (input || "").replace(/[^\d+]/g, "");
  // Strip prefixes and normalize to local 9 digits
  if (n.startsWith("+255")) n = n.slice(4);
  else if (n.startsWith("255")) n = n.slice(3);
  else if (n.startsWith("0")) n = n.slice(1);
  // Keep only digits
  n = n.replace(/\D/g, "").slice(0, 9);
  const local = n;
  const e164 = local ? `${TZ_CC}${local}` : "";
  return { e164, local };
}

export function prettyTZ(local: string): string {
  const s = (local || "").padEnd(9, " ");
  return `${TZ_CC} ${s.slice(0,3)} ${s.slice(3,6)} ${s.slice(6,9)}`.trim();
}

export function isValidTZ(local: string): boolean {
  return /^\d{9}$/.test(local) && /^[67]/.test(local); // TZ mobile ranges typically 6/7…
}
