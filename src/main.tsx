/// <reference types="vite/client" />

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: "http://localhost:5173/",
  logout_uri: "http://localhost:5173/login",
  client_secret: import.meta.env.VITE_COGNITO_CLIENT_SECRET,
  response_type: "code",
  scope: "email openid phone",
  onSigninCallback: (user: any) => {
    console.log("Sign-in successful:", user);
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  onSignoutCallback: () => {
    console.log("Sign-out successful");
  },
};

// Debug: Log configuration (remove sensitive info in production)
console.log("Cognito Config:", {
  authority: cognitoAuthConfig.authority,
  client_id: cognitoAuthConfig.client_id,
  redirect_uri: cognitoAuthConfig.redirect_uri,
});

// Validate environment variables
if (!cognitoAuthConfig.authority || !cognitoAuthConfig.client_id) {
  console.error("Missing Cognito environment variables!");
  console.error("VITE_COGNITO_AUTHORITY:", cognitoAuthConfig.authority);
  console.error("VITE_COGNITO_CLIENT_ID:", cognitoAuthConfig.client_id);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
) 