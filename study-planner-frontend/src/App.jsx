import { useState } from 'react'
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Planner from './pages/Planner';
import Analysis from './pages/Analysis';
import Auth from './pages/Auth/Auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
  Boolean(localStorage.getItem("token")));

  return (
    <BrowserRouter>
    {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth setIsAuthenticated={setIsAuthenticated} />}/>
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/planner" element={isAuthenticated ? <Planner /> : <Navigate to="/auth" />} />
        <Route path="/analysis" element={isAuthenticated ? <Analysis /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App