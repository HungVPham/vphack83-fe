import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Handle authentication state changes - redirect immediately when authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  // Wait for initial authentication check to complete
  useEffect(() => {
    if (!auth.isLoading) {
      setHasCheckedAuth(true);
    }
  }, [auth.isLoading]);

  const handleLogin = () => {
    auth.signinRedirect();
  };

  const handleContinueToApp = () => {
    navigate("/app", { replace: true });
  };

  // Handle different authentication states
  switch (auth.activeNavigator) {
    case "signinSilent":
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#015aad] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang xác thực tự động...</p>
          </div>
        </div>
      );
    case "signoutRedirect":
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#015aad] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang đăng xuất...</p>
          </div>
        </div>
      );
  }

  // Show loading state during authentication or if we haven't completed initial check
  if (auth.isLoading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#015aad] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated after the check is complete, show welcome message
  // This should rarely be seen since useEffect should redirect immediately
  if (auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#015aad] to-[#00b74f] rounded-lg flex items-center justify-center">
                <img
                  src="/vpbcredai-logo.png"
                  alt="VPB.CredAI"
                  width={40}
                  height={40}
                />
              </div>
              <span className="text-2xl font-bold text-gray-800">VPB.CredAI</span>
            </div>
          </div>

          {/* Already logged in card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                Chào mừng trở lại!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-gray-600 mb-4">
                  <p>Bạn đã đăng nhập thành công.</p>
                  <p className="text-sm mt-2">
                    Chào mừng {auth.user?.profile?.email || auth.user?.profile?.name || "bạn"}!
                  </p>
                </div>
                
                <Button
                  onClick={handleContinueToApp}
                  className="w-full"
                >
                  Tiếp tục vào ứng dụng
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 VPBank – Bản quyền đã được bảo hộ</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login form for unauthenticated users - only after auth check is complete
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#015aad] to-[#00b74f] rounded-lg flex items-center justify-center">
              <img
                src="/vpbcredai-logo.png"
                alt="VPB.CredAI"
                width={40}
                height={40}
              />
            </div>
            <span className="text-2xl font-bold text-gray-800">VPB.CredAI</span>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 text-center">
              Đăng Nhập
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={handleLogin}
                className="w-full"
                disabled={auth.isLoading}
              >
                {auth.isLoading ? "Đang đăng nhập..." : "Đăng Nhập với AWS Cognito"}
              </Button>
              
              {auth.error && (
                <div className="text-red-600 text-sm text-center p-3 bg-red-50 rounded-md">
                  <div className="font-medium">Có lỗi xảy ra khi đăng nhập:</div>
                  <div className="mt-1 text-xs">{auth.error.message}</div>
                  <div className="mt-1 text-xs opacity-75">
                    {auth.error.name && `Error: ${auth.error.name}`}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 VPBank – Bản quyền đã được bảo hộ</p>
        </div>
      </div>
    </div>
  );
}
