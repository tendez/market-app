// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StallSelection from './components/StallSelection';
import StallDashboard from './components/StallDashboard';
import SalesOverview from './components/SalesOverview';
import UserSales from './components/UserSales';
import SpeciesSelection from './components/SpeciesSelection';
import SizeSelection from './components/SizeSelection';
import PriceSelection from './components/PriceSelection';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/stalls" element={
              <ProtectedRoute>
                <StallSelection />
              </ProtectedRoute>
            } />
            <Route path="/stall/:stallId" element={
              <ProtectedRoute>
                <StallDashboard />
              </ProtectedRoute>
            } />
            <Route path="/stall/:stallId/sales" element={
              <ProtectedRoute>
                <SalesOverview />
              </ProtectedRoute>
            } />
            <Route path="/stall/:stallId/my-sales" element={
              <ProtectedRoute>
                <UserSales />
              </ProtectedRoute>
            } />
            <Route path="/stall/:stallId/add-sale/species" element={
              <ProtectedRoute>
                <SpeciesSelection />
              </ProtectedRoute>
            } />
            <Route path="/stall/:stallId/add-sale/size" element={
              <ProtectedRoute>
                <SizeSelection />
              </ProtectedRoute>
            } />
            <Route path="/stall/:stallId/add-sale/price" element={
              <ProtectedRoute>
                <PriceSelection />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
