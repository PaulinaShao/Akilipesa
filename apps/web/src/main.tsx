import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enable Builder.io Visual Editing
import { enableVisualEditing } from '@builder.io/sdk-react'
import './builder-registry' // Register components for visual editing

// Only enable visual editing if we have a valid public key
if (import.meta.env.VITE_BUILDER_PUBLIC_KEY && import.meta.env.VITE_BUILDER_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
  enableVisualEditing({
    project: import.meta.env.VITE_BUILDER_PUBLIC_KEY!,
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
