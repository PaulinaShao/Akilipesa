import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Configure Builder.io
import { Builder } from '@builder.io/sdk-react'
import './builder-registry' // Register components for visual editing

// Initialize Builder.io with your public key
if (import.meta.env.VITE_BUILDER_PUBLIC_KEY && import.meta.env.VITE_BUILDER_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
  Builder.init(import.meta.env.VITE_BUILDER_PUBLIC_KEY!)
  console.log('✅ Builder.io initialized with key:', import.meta.env.VITE_BUILDER_PUBLIC_KEY.substring(0, 8) + '...')
} else {
  console.warn('⚠️  Builder.io public key not found or is placeholder')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
