// Debug script to identify elements blocking bottom navigation
// Paste this in browser DevTools console to test

console.log('🔍 Debugging Bottom Navigation Blockers...');

// Emergency unblock script
function emergencyUnblock() {
  document.querySelectorAll('*').forEach(el => {
    const s = getComputedStyle(el);
    if ((s.position === 'fixed' || s.position === 'absolute') && 
        (s.bottom === '0px' || s.inset === '0px')) {
      console.log('Found potential blocker:', el);
      el.style.pointerEvents = 'none';
    }
  });
}

// Check for bottom nav element
const bottomNav = document.querySelector('.bottom-nav');
if (bottomNav) {
  console.log('✅ Bottom nav found:', bottomNav);
  console.log('Bottom nav styles:', getComputedStyle(bottomNav));
} else {
  console.log('❌ Bottom nav NOT found in DOM');
}

// Check for elements that might be blocking
const blockers = Array.from(document.querySelectorAll('*')).filter(el => {
  const s = getComputedStyle(el);
  return (s.position === 'fixed' || s.position === 'absolute') && 
         (s.bottom === '0px' || s.inset === '0px') &&
         el.classList.toString().includes('glass');
});

if (blockers.length > 0) {
  console.log('⚠️  Potential blockers found:', blockers);
  console.log('Run emergencyUnblock() to disable pointer events on these elements');
} else {
  console.log('✅ No blocking elements detected');
}

// Make emergency function available globally
window.emergencyUnblock = emergencyUnblock;
