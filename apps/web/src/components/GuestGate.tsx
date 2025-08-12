import React from "react";
import { useNavigate } from "react-router-dom";

export default function GuestGate({ onClose }: { onClose?: () => void }) {
  const nav = useNavigate();
  return (
    <div className="fixed inset-0 bg-black/60 z-[999] grid place-items-center">
      <div className="w-[92%] max-w-[420px] rounded-2xl p-6 bg-[var(--panel)] shadow-xl">
        <h3 className="text-xl font-semibold mb-2">Unlock more with AkiliPesa</h3>
        <ul className="text-sm text-[var(--muted)] leading-6 mb-4 list-disc pl-5">
          <li>Earn from your creations</li>
          <li>Sell products & services</li>
          <li>Live calls with AI & creators</li>
          <li>Withdraw to mobile money</li>
        </ul>
        <div className="grid gap-2">
          <button className="btn-primary" onClick={()=>nav("/auth/login")}>Continue with Phone</button>
          <button className="btn-secondary" onClick={()=>nav("/auth/login?with=google")}>Continue with Google</button>
          <button className="btn-ghost mt-1" onClick={onClose}>Maybe later</button>
        </div>
      </div>
    </div>
  );
}
