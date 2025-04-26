import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css' // Import global styles
import '@salt-ds/theme/index.css'; // Import Salt theme CSS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
