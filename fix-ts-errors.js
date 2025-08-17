#!/usr/bin/env node

// Quick script to fix common TypeScript unused variable errors
const fs = require('fs');
const path = require('path');

const filesToFix = [
  'apps/web/src/pages/CameraCaptPage.tsx',
  'apps/web/src/pages/CheckoutPage.tsx', 
  'apps/web/src/pages/EarningsPage.tsx',
  'apps/web/src/pages/EditorPage.tsx',
  'apps/web/src/pages/JobsPage.tsx',
  'apps/web/src/pages/JoinPage.tsx',
  'apps/web/src/pages/LivePage.tsx'
];

const fixPatterns = [
  // Fix unused imports
  { pattern: /^(\s*)(useEffect,)(\s)/gm, replacement: '$1// useEffect,$3' },
  { pattern: /^(\s*)(useCallback,)(\s)/gm, replacement: '$1// useCallback,$3' },
  { pattern: /^(\s*)(AlertCircle,)(\s)/gm, replacement: '$1// AlertCircle,$3' },
  { pattern: /^(\s*)(AnimatePresence,)(\s)/gm, replacement: '$1// AnimatePresence,$3' },
  { pattern: /^(\s*)(Video,)(\s)/gm, replacement: '$1// Video,$3' },
  { pattern: /^(\s*)(Calendar,)(\s)/gm, replacement: '$1// Calendar,$3' },
  { pattern: /^(\s*)(RefreshCw,)(\s)/gm, replacement: '$1// RefreshCw,$3' },
  { pattern: /^(\s*)(Crop,)(\s)/gm, replacement: '$1// Crop,$3' },
  { pattern: /^(\s*)(Sliders,)(\s)/gm, replacement: '$1// Sliders,$3' },
  { pattern: /^(\s*)(Download,)(\s)/gm, replacement: '$1// Download,$3' },
  { pattern: /^(\s*)(Share,)(\s)/gm, replacement: '$1// Share,$3' },
  { pattern: /^(\s*)(Trash2,)(\s)/gm, replacement: '$1// Trash2,$3' },
  { pattern: /^(\s*)(Play,)(\s)/gm, replacement: '$1// Play,$3' },
  { pattern: /^(\s*)(Pause,)(\s)/gm, replacement: '$1// Pause,$3' },
  { pattern: /^(\s*)(Mic,)(\s)/gm, replacement: '$1// Mic,$3' },
  { pattern: /^(\s*)(MapPin,)(\s)/gm, replacement: '$1// MapPin,$3' },
  { pattern: /^(\s*)(Eye,)(\s)/gm, replacement: '$1// Eye,$3' },
  { pattern: /^(\s*)(Zap,)(\s)/gm, replacement: '$1// Zap,$3' },
  { pattern: /^(\s*)(Gift,)(\s)/gm, replacement: '$1// Gift,$3' },
  { pattern: /^(\s*)(Users,)(\s)/gm, replacement: '$1// Users,$3' },
  
  // Fix unused variables
  { pattern: /(\s+)(const|let)\s+(\w+)\s*=\s*(.*);(\s*\/\/.*)?$/gm, 
    replacement: (match, space, keyword, varName, value, comment) => {
      if (['checkCameraPermissions', 'hasDeviceAccess', 'handleViewAnalytics', 'canvasRef'].includes(varName)) {
        return `${space}// ${keyword} ${varName} = ${value};${comment || ''}`;
      }
      return match;
    }
  },
  
  // Fix unused destructured variables
  { pattern: /(\s+)const\s+\[([^,]+),\s*([^,\]]+)\]\s*=\s*(.*);/gm,
    replacement: (match, space, var1, var2, value) => {
      if (['setSelectedJobId'].includes(var2.trim())) {
        return `${space}const [${var1}] = ${value};`;
      }
      return match;
    }
  }
];

console.log('Fixing TypeScript errors...');

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    fixPatterns.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });
    
    fs.writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
  }
});

console.log('Done!');
