import { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Auth from './pages/Auth/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Subjects from './pages/Subjects.jsx';
import Topics from './pages/Topics.jsx';
import Tests from './pages/Tests.jsx';
import Navbar from './components/navbar.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

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
        
        {/* Placeholder routes */}
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
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;