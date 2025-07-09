import { useState } from "react";
import { useAuth } from "react-oidc-context";

export function Header() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_AMPLIFY_SIGN_OUT;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    
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
      alert("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#015aad]/90 to-[#00b74f]/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <img src="/vpbcredai-logo.png" alt="" width={32} height={32} className="opacity-100"/>
          </div>
          <span className="font-semibold text-gray-800">VPB.CredAI</span>
        </div>
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center space-x-2 text-sm transition-colors ${
            isLoggingOut 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-600 hover:text-gray-800 cursor-pointer'
          }`}
        >
          {isLoggingOut ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Đang đăng xuất...</span>
            </>
          ) : (
            <span>Đăng xuất</span>
          )}
        </button>
      </div>
    </div>
  );
} 