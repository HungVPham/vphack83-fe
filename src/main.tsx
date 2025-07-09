/// <reference types="vite/client" />

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

// Custom user storage with detailed logging to track key format issues
const createUserStore = (authority: string, client_id: string) => {
  const expectedUserKey = `oidc.user:${authority}:${client_id}`;
  
  return {
    get: async (key: string) => {

      // Try the expected key first
      let value = localStorage.getItem(expectedUserKey);

      if (value) {
        return value;
      }
      
      // If not found, try the provided key
      value = localStorage.getItem(key);
      if (value) {
        return value;
      }
      
      // If still not found, search for any oidc.user keys
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(k => k.startsWith('oidc.user:'));
      
      if (userKeys.length > 0) {
        const foundValue = localStorage.getItem(userKeys[0]);
        return foundValue;
      }
      
      return null;
    },
    set: async (key: string, value: string) => {
      
      // Always store with the expected key format
      localStorage.setItem(expectedUserKey, value);
      
      // Also store with the provided key for compatibility
      if (key !== expectedUserKey) {
        localStorage.setItem(key, value);
      }
    },
    remove: async (key: string) => {
      
      // Remove from expected key
      localStorage.removeItem(expectedUserKey);
      
      // Remove from provided key
      localStorage.removeItem(key);
      
      // Clean up any other user keys
      const allKeys = Object.keys(localStorage);
      const userKeys = allKeys.filter(k => k.startsWith('oidc.user:'));
      userKeys.forEach(k => {
        localStorage.removeItem(k);
      });
    }
  };
};

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_AMPLIFY_DOMAIN || window.location.origin,
  post_logout_redirect_uri: import.meta.env.VITE_AMPLIFY_SIGN_OUT || `${window.location.origin}/login`,
  client_secret: import.meta.env.VITE_COGNITO_CLIENT_SECRET,
  response_type: "code",
  scope: "email openid phone",
  
  // Silent authentication configuration - crucial for auto-login
  automaticSilentRenew: true,
  silent_redirect_uri: import.meta.env.VITE_AMPLIFY_DOMAIN || window.location.origin,
  includeIdTokenInSilentRenew: true,
  loadUserInfo: true,
  
  // Token and session management
  revokeTokensOnSignout: true,
  
  // Additional settings for better reliability with AWS Cognito
  filterProtocolClaims: true,
  clockSkew: 300, // 5 minutes clock skew tolerance
  staleStateAge: 900, // 15 minutes
  
  // Custom storage configuration to fix key mismatch issues
  userStore: createUserStore(
    import.meta.env.VITE_COGNITO_AUTHORITY,
    import.meta.env.VITE_COGNITO_CLIENT_ID
  ),
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
  
  // Additional OIDC settings that might help with Cognito
  validateSubOnSilentRenew: true,
  
  // Add response mode for better compatibility
  response_mode: "query",
  
  // Enhanced callbacks with storage debugging
  onSigninCallback: () => {
    // Clean up the URL by removing query parameters and fragments
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  onSignoutCallback: () => {
    // Clean up any remaining URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
) 