export const TZ_ISO = "TZ";
export const TZ_CC = "+255";

export function normalizeTZ(input: string): { e164: string; local: string } {
  let n = (input || "").replace(/[^\d+]/g, "");
  if (n.startsWith("+255")) n = n.slice(4);
  else if (n.startsWith("255")) n = n.slice(3);
  else if (n.startsWith("0")) n = n.slice(1);
  n = n.replace(/\D/g, "").slice(0, 9);
  return { e164: n ? TZ_CC + n : "", local: n };
}

export function prettyTZ(local: string): string {
  const s = (local || "").padEnd(9, " ");
  return `${TZ_CC} ${s.slice(0,3)} ${s.slice(3,6)} ${s.slice(6,9)}`.trim();
}

export function isValidTZ(local: string): boolean {
  return /^\d{9}$/.test(local) && /^[67]/.test(local);
}

export function formatTZPhone(local: string): string {
  if (!local) return '';
  const cleaned = local.replace(/\D/g, '');
  if (cleaned.length >= 9) {
    return `+255 ${cleaned.slice(0,3)} ${cleaned.slice(3,6)} ${cleaned.slice(6,9)}`;
  }
  return `+255 ${cleaned}`;
}
