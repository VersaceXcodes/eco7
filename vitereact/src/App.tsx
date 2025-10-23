import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '@/store/main';

// Import views
import GV_TopNav from '@/components/views/GV_TopNav.tsx';
import GV_Footer from '@/components/views/GV_Footer.tsx';
import UV_Landing from '@/components/views/UV_Landing.tsx';
import UV_Registration from '@/components/views/UV_Registration.tsx';
import UV_Profile from '@/components/views/UV_Profile.tsx';
import UV_CarbonFootprintCalculator from '@/components/views/UV_CarbonFootprintCalculator.tsx';
import UV_CommunityForum from '@/components/views/UV_CommunityForum.tsx';
import UV_EducationalResources from '@/components/views/UV_EducationalResources.tsx';
import UV_EcoShop from '@/components/views/UV_EcoShop.tsx';
import UV_ChallengeDashboard from '@/components/views/UV_ChallengeDashboard.tsx';
import UV_Partnerships from '@/components/views/UV_Partnerships.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  const isLoading = useAppStore(state => state.authentication_state.authentication_status.is_loading);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const initializeAuth = useAppStore(state => state.initialize_auth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className="App min-h-screen flex flex-col">
          <GV_TopNav />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<UV_Landing />} />
              <Route path="/register" element={<UV_Registration />} />
              
              {/* Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UV_Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/carbon-footprint-calculator" 
                element={
                  <ProtectedRoute>
                    <UV_CarbonFootprintCalculator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community-forum" 
                element={
                  <ProtectedRoute>
                    <UV_CommunityForum />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/educational-resources" 
                element={
                  <ProtectedRoute>
                    <UV_EducationalResources />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/eco-shop" 
                element={
                  <ProtectedRoute>
                    <UV_EcoShop />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/challenges" 
                element={
                  <ProtectedRoute>
                    <UV_ChallengeDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/partnerships" 
                element={
                  <ProtectedRoute>
                    <UV_Partnerships />
                  </ProtectedRoute>
                } 
              />
              {/* Catch all - redirect based on auth status */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <GV_Footer />
        </div>
      </QueryClientProvider>
    </Router>
  );
};

export default App;