import { useEffect, useRef } from "react";

type Props = { 
  id: string; 
  children: React.ReactNode;
  className?: string;
};

/** 
 * Wrap each page with <Screen id="route-key">...</Screen>
 * id should be a stable key per tab/route (e.g., "home", "discover")
 */
export default function Screen({ id, children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Restore remembered scroll position for this screen
  useEffect(() => {
    const key = `scroll:${id}`;
    const y = Number(sessionStorage.getItem(key) ?? 0);
    const el = ref.current;
    
    if (el) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        el.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
      });
    }

    const onScroll = () => {
      if (!el) return;
      // Debounce scroll position saving for performance
      const saveScroll = () => {
        sessionStorage.setItem(key, String(el.scrollTop));
      };
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(saveScroll);
      } else {
        setTimeout(saveScroll, 16); // ~60fps fallback
      }
    };

    el?.addEventListener("scroll", onScroll, { passive: true });
    return () => el?.removeEventListener("scroll", onScroll);
  }, [id]);

  return (
    <div 
      ref={ref} 
      className={`tz-bg min-h-dvh pb-safe-nav scroll-screen hide-scrollbar ${className}`}
    >
      {children}
    </div>
  );
}
