
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleStallSelection = () => {
    navigate('/stalls');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Panel glowny</h1>
        <div className="user-info">
          <span>Witaj, {currentUser?.login}</span>
          <span>Rola: {currentUser?.role}</span>
          <button onClick={handleLogout} className="logout-btn">
            Wyloguj sie
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Wybor stoiska</h3>
          <p>Wybierz stoisko, z ktorym chcesz pracowac</p>
          <button onClick={handleStallSelection} className="primary-btn">
            Wybierz stoisko
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
