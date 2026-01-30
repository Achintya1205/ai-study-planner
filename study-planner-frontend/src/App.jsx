import { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Auth from './pages/Auth/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to auth or dashboard based on authentication */}
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
        
        {/* Protected Dashboard route */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard /> : 
            <Navigate to="/auth" />
          } 
        />
        
        {/* Placeholder routes for quick actions (add these pages later) */}
        <Route 
          path="/study-session" 
          element={
            isAuthenticated ? 
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Study Session</h1>
                <p className="text-gray-600">This page will be built next!</p>
              </div>
            </div> : 
            <Navigate to="/auth" />
          } 
        />
        
        <Route 
          path="/analytics" 
          element={
            isAuthenticated ? 
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Analytics</h1>
                <p className="text-gray-600">Analytics page coming soon!</p>
              </div>
            </div> : 
            <Navigate to="/auth" />
          } 
        />
        
        <Route 
          path="/study-plan" 
          element={
            isAuthenticated ? 
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Study Plan</h1>
                <p className="text-gray-600">AI-powered study planner coming soon!</p>
              </div>
            </div> : 
            <Navigate to="/auth" />
          } 
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;