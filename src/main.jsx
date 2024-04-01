import React from 'react'
import ReactDOM from 'react-dom/client'
import { GlobalStateProvider } from './context/GlobalStateContext';
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>,
)