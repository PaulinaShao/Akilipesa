import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clean Tanzanite App Shell JS
(function(){
  // Stable viewport unit on mobile URL bar changes
  const setVH = () => {
    document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
  };
  setVH(); addEventListener('resize', setVH, {passive:true});

  // Header auto-hide (down hides, up reveals)
  const h = document.querySelector('.auto-hide-header');
  let last = scrollY, ticking = false;
  const run = () => { const y = scrollY; if(Math.abs(y-last)>4){ y>last ? h?.classList.add('hidden') : h?.classList.remove('hidden'); last=y; } ticking=false; };
  addEventListener('scroll', ()=>{ if(!ticking){ requestAnimationFrame(run); ticking=true; } }, {passive:true});
})();

// Import RTC test in development (disabled to prevent frame errors)
// if (import.meta.env.DEV) {
//   import('./test-rtc');
// }

// Configure Builder.io
import { builder } from '@builder.io/react'
import './builder-registry' // Register components for visual editing

// Initialize Builder.io with your public key (deferred to avoid frame errors)
function initBuilderSafely() {
  try {
    if (import.meta.env.VITE_BUILDER_PUBLIC_KEY && import.meta.env.VITE_BUILDER_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
      // Check if we're in a safe environment (not in an iframe that might cause frame errors)
      const isInSafeEnvironment = typeof window !== 'undefined' &&
                                   window.self === window.top &&
                                   document.readyState !== 'loading';

      if (isInSafeEnvironment || import.meta.env.DEV) {
        builder.init(import.meta.env.VITE_BUILDER_PUBLIC_KEY!)
        console.log('✅ Builder.io initialized with key:', import.meta.env.VITE_BUILDER_PUBLIC_KEY.substring(0, 8) + '...')
      } else {
        console.log('⚠️ Skipping Builder.io init in iframe environment or during loading')
      }
    } else {
      console.warn('⚠️ Builder.io public key not found or is placeholder')
    }
  } catch (error) {
    console.warn('⚠️ Builder.io initialization failed:', error)
  }
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBuilderSafely);
} else {
  initBuilderSafely();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
