// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';  // Corrected import path
import Register from './pages/Register'; // Corrected import path
import Home from './pages/Home'; // Corrected import path
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} setAuth={setIsAuthenticated} />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Home setAuth={setIsAuthenticated} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
