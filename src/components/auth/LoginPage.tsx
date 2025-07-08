import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Starting sign-in process...");
    auth.signinRedirect();
  };

  // Console log auth state for debugging
  console.log("Auth state:", {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    user: auth.user
  });

  // If user is already authenticated, redirect to app
  if (auth.isAuthenticated) {
    console.log("User is authenticated, redirecting to app...");
    navigate("/app");
    return null;
  }

  // Show loading state during authentication
  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#015aad] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý...</p>
        </div>
      </div>
    );
  }

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

            {/* <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <button className="text-[#015aad] hover:underline font-medium">
                  Đăng ký ngay
                </button>
              </p>
            </div> */}
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
