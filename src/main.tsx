import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './ui/App'
import './index.css'

console.log('main.tsx loading - simple version...')

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

console.log('App rendered')
