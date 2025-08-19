import { useEffect, useRef } from "react";

type Props = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Wrap each page with <Screen>...</Screen>
 * Keeps scroll + nav spacing everywhere
 */
export default function Screen({ id, children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Restore remembered scroll position for this screen (if id provided)
  useEffect(() => {
    if (!id) return;

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
    <main
      ref={ref}
      className={`scroll-screen relative tz-bg ${className}`}
    >
      {children}
    </main>
  );
}
