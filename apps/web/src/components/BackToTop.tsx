import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>('.scroll-screen');
    if (!el) return;

    const onScroll = () => {
      const shouldShow = el.scrollTop > 600;
      // Only update state if it changed to prevent unnecessary re-renders
      setShow(prev => prev !== shouldShow ? shouldShow : prev);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const el = document.querySelector<HTMLElement>('.scroll-screen');
    el?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={scrollToTop}
          className="fixed bottom-[calc(var(--nav-h)+var(--safe-b)+16px)] right-4 h-10 w-10 rounded-full tz-gem-border tz-action-button grid place-items-center shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
