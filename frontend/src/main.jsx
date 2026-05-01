import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pull the variable securely from Vite's environment build
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Debug: Log the client ID to verify it's loading
if (!clientId) {
  console.warn('⚠️ VITE_GOOGLE_CLIENT_ID is not set. Check your .env file.');
  console.warn('Available env vars:', import.meta.env);
} else {
  console.log('✓ Google Client ID loaded successfully');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || ''}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)