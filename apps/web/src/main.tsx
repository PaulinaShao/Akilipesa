import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Configure Builder.io
import { enableVisualEditing } from '@builder.io/sdk-react';
import './builder-registry' // Register components for visual editing

enableVisualEditing({
  project: import.meta.env.VITE_BUILDER_PUBLIC_KEY!,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
