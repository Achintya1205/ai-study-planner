import { useState } from 'react';
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