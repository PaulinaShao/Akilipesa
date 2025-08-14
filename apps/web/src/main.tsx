import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Configure Builder.io
import { builder } from '@builder.io/react'
import './builder-registry' // Register components for visual editing

// Initialize Builder.io with your public key
if (import.meta.env.VITE_BUILDER_PUBLIC_KEY && import.meta.env.VITE_BUILDER_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
  builder.init(import.meta.env.VITE_BUILDER_PUBLIC_KEY!)

  // Enable visual editing when in Builder.io editor
  if (typeof window !== 'undefined') {
    // Check if we're in Builder.io's visual editor
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('builder.space') || urlParams.get('builder.user.id') || window.parent !== window) {
      // Enable editing mode for visual editing
      builder.isEditing = true
      builder.editingMode = true
    }
  }

  console.log('✅ Builder.io initialized with key:', import.meta.env.VITE_BUILDER_PUBLIC_KEY.substring(0, 8) + '...')
} else {
  console.warn('⚠️  Builder.io public key not found or is placeholder')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
