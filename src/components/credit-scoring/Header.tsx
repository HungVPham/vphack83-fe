import { useState } from "react";
import { useAuth } from "react-oidc-context";
import LanguageToggle from "../ui/language-toggle";
import { useLanguage } from "../../lib/LanguageContext";

export function Header() {
  const auth = useAuth();
  const { t } = useLanguage();

  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_AMPLIFY_SIGN_OUT;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm(t('header.logout.confirm'));
    
    if (!confirmLogout) {
      return;
    }

    try {
      setIsLoggingOut(true);
      console.log("Starting logout process...");
      
      // Sign out from Cognito
      auth.removeUser();
      signOutRedirect();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
      alert(t('header.logout.error'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-[#015aad]/90 to-[#00b74f]/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <img src="/vpbcredai-logo.png" alt="" width={32} height={32} className="opacity-100"/>
          </div>
          <span className="font-semibold text-gray-800">VPB.CredAI</span>
        </button>
        
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <LanguageToggle />
          
          {/* Logout Button with Exit Icon */}
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center space-x-3 text-sm transition-colors ${
              isLoggingOut 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:text-gray-800 cursor-pointer'
            }`}
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>{t('header.logout.loading')}</span>
              </>
            ) : (
              <svg 
                className="w-[1.790rem] h-[1.790rem]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 