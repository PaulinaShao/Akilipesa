import { useEffect, useRef, useState } from "react";

export function HeaderTop({ isAuthed }: { isAuthed: boolean }){
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if(!isAuthed) return; // keep visible until they sign in
    const onScroll = () => {
      const y = window.scrollY || 0;
      setHidden(y > 24 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAuthed]);

  return (
    <header
      className={`
        fixed top-0 inset-x-0 z-40 transition-transform duration-300
        ${hidden ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <div className="mx-auto max-w-screen-sm px-3 pt-[env(safe-area-inset-top)]">
        <div className="tnz-glass rounded-2xl px-3 py-2 flex items-center justify-between text-white">
          <div className="font-semibold tracking-wide">AKILIPESA</div>

          {/* LIVE badge can stay here if you like */}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-fuchsia-600/80 px-3 py-1 text-[11px] font-bold shadow">LIVE</span>

            {/* Sign in pill (hidden after auth) */}
            {!isAuthed && (
              <button
                className="rounded-full bg-rose-600/90 px-3 py-1 text-[12px] font-semibold shadow"
                onClick={() => window.dispatchEvent(new CustomEvent("open-signin"))}
                aria-label="Sign in"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
