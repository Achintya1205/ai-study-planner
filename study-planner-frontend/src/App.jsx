import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Auth from './pages/Auth/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Subjects from './pages/Subjects.jsx';
import Topics from './pages/Topics.jsx';
import Tests from './pages/Tests.jsx';
import StudySession from './pages/StudySession.jsx';
import Analytics from './pages/Analytics.jsx';
import StudyPlan from './pages/Studyplan.jsx';
import Navbar from './components/navbar.jsx';
import { getCurrentUser } from './api/auth.api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setAuthLoading(false);
      }
    };

    verifySession();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Checking session...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />} 
        />
        
        {/* Auth route */}
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Auth setIsAuthenticated={setIsAuthenticated} />
          }
        />
        
        {/* Dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard /> : 
            <Navigate to="/auth" />
          } 
        />
        
        {/* Subjects route */}
        <Route 
          path="/subjects" 
          element={
            isAuthenticated ? 
            <Subjects /> : 
            <Navigate to="/auth" />
          } 
        />
        
        {/* Topics route */}
        <Route 
          path="/topics" 
          element={
            isAuthenticated ? 
            <Topics /> : 
            <Navigate to="/auth" />
          } 
        />
        
        {/* Tests route */}
        <Route 
          path="/tests" 
          element={
            isAuthenticated ? 
            <Tests /> : 
            <Navigate to="/auth" />
          } 
        />
        
        {/* Study Session route */}
        <Route 
          path="/study-session" 
          element={
            isAuthenticated ? 
            <StudySession /> : 
            <Navigate to="/auth" />
          } 
        />
        
        {/* Analytics route */}
        <Route 
          path="/analytics" 
          element={
            isAuthenticated ? 
            <Analytics /> : 
            <Navigate to="/auth" />
          } 
        />
        
        {/* Study Plan route */}
        <Route 
          path="/study-plan" 
          element={
            isAuthenticated ? 
            <StudyPlan /> : 
            <Navigate to="/auth" />
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;