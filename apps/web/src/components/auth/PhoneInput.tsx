import { useState } from "react";
import { normalizeTZ } from "@/lib/phone";

export default function PhoneInput({ value, onChange, error }: {
  value?: string; onChange: (e164: string, local: string) => void; error?: string;
}) {
  const [local, setLocal] = useState(value?.replace("+255","") ?? "");
  const { e164 } = normalizeTZ(local);

  return (
    <div className="w-full">
      <label className="block text-sm text-zinc-300 mb-2">Phone number</label>
      <div className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-3 focus-within:ring-2 ring-violet-500">
        <div className="shrink-0 text-zinc-400 font-medium">TZ&nbsp;+255</div>
        <input
          inputMode="numeric"
          value={local}
          onChange={(e) => {
            const { e164: out, local: loc } = normalizeTZ(e.target.value);
            setLocal(loc);
            onChange(out, loc);
          }}
          placeholder="7XX XXX XXX"
          className="w-full bg-transparent outline-none tracking-widest text-zinc-100"
        />
      </div>
      <p className="mt-1 text-xs text-zinc-500">Format: 7XX XXX XXX</p>
      {!!error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
      {/* hidden pretty preview for debugging: */}
      {/* <p className="text-xs text-zinc-400 mt-1">{prettyTZ(local)} ({e164})</p> */}
    </div>
  );
}
