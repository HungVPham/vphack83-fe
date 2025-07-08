import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CreditScoringApp } from './components/credit-scoring/CreditScoringApp';
import { LoginPage } from './components/auth/LoginPage';
import { useAuth } from 'react-oidc-context';
import './App.css'

function AuthHandler() {
  const auth = useAuth();
  
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
  
  if (auth.isAuthenticated) {
    return <Navigate to="/app" replace />;
  }
  
  return <Navigate to="/login" replace />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  
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
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {  
  return (
    <Router>
      <Routes>

        <Route path="/" element={<AuthHandler />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app" element={
          <ProtectedRoute>
            <CreditScoringApp />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App 