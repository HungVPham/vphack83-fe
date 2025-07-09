/// <reference types="vite/client" />

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_AMPLIFY_DOMAIN,
  post_logout_redirect_uri: import.meta.env.VITE_AMPLIFY_SIGN_OUT,
  client_secret: import.meta.env.VITE_COGNITO_CLIENT_SECRET,
  response_type: "code",
  scope: "email openid phone",
  
  // Silent authentication configuration - crucial for auto-login
  automaticSilentRenew: true,
  silent_redirect_uri: import.meta.env.VITE_AMPLIFY_DOMAIN,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
  
  // Token and session management
  revokeTokensOnSignout: true,
  
  // Additional settings for better reliability with AWS Cognito
  filterProtocolClaims: true,
  clockSkew: 300, // 5 minutes clock skew tolerance
  staleStateAge: 900, // 15 minutes
  
  // Explicit storage configuration
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
  
  // Additional OIDC settings that might help with Cognito
  validateSubOnSilentRenew: true,
  
  // Add response mode for better compatibility
  response_mode: "query",
  
  // Callbacks
  onSigninCallback: () => {
    // Clean up the URL by removing query parameters and fragments
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  onSignoutCallback: () => {
    // Clean up any remaining URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

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