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
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
