import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import BlogList from './components/Blog/BlogList';
import BlogDetail from './components/Blog/BlogDetail';
import AudioList from './components/Audio/AudioList';
import VideoList from './components/Video/VideoList';
import Login from './components/Admin/Login';
import Dashboard from './components/Admin/Dashboard';
import AdminLayout from './components/Admin/AdminLayout';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import NotFound from './pages/NotFound';
import { authService } from './services/api';

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in on app load
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            {/* Show main nav only on public routes */}
            <Routes>
              <Route path="/admin/*" element={null} />
              <Route path="*" element={<Navbar />} />
            </Routes>
            
            <main>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<BlogList />} />
                <Route path="/blog" element={<BlogList />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/audio" element={<AudioList />} />
                <Route path="/video" element={<VideoList />} />
                
                {/* Admin Login */}
                <Route 
                  path="/admin/login" 
                  element={
                    isAuthenticated ? 
                    <DashboardWrapper /> : 
                    <Login onLogin={handleLogin} />
                  } 
                />
                
                {/* Protected Admin Routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AdminLayout onLogout={handleLogout}>
                        <Dashboard />
                      </AdminLayout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Helper component to handle dashboard redirect
const DashboardWrapper = () => {
  useEffect(() => {
    window.location.href = '/admin/dashboard';
  }, []);
  
  return <div>Redirecting to dashboard...</div>;
};

export default App;