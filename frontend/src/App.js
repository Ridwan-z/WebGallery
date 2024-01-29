import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './Admin';
import LandingPage from './LandingPage';
import Login from './auth/Login'; 
import Register from './auth/Register'; 
import Error from './Error';
import { AuthProvider } from './auth/AuthContext';

function App() {
    
    return (
        <Router>
            <AuthProvider>
                <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/home/*" element={<LandingPage />} />
                <Route path="*" element={<Error />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
