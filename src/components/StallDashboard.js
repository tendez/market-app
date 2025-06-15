// src/components/StallDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const StallDashboard = () => {
  const { stallId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stall, setStall] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStallData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/stoisko/${stallId}`);
      setStall(response.data);
    } catch (error) {
      console.error('Blad pobierania danych stoiska:', error);
    } finally {
      setLoading(false);
    }
  }, [stallId]);

  useEffect(() => {
    fetchStallData();
  }, [fetchStallData]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChangeStall = () => {
    navigate('/stalls');
  };

  const handleAllSales = () => {
    navigate(`/stall/${stallId}/sales`);
  };

  const handleMySales = () => {
    navigate(`/stall/${stallId}/my-sales`);
  };

  const handleAddSale = () => {
    navigate(`/stall/${stallId}/add-sale/species`);
  };

  if (loading) return <div className="loading">Ladowanie...</div>;

  return (
    <div className="stall-dashboard">
      <div className="dashboard-header">
        <h1>Stoisko: {stall?.nazwa || `Stoisko ${stallId}`}</h1>
        <div className="header-actions">
          <button onClick={handleLogout} className="logout-btn">
            Wyloguj sie
          </button>
        </div>
      </div>

      <div className="dashboard-menu">
        <div className="menu-item">
          <h3>Zmiana stoiska</h3>
          <button onClick={handleChangeStall} className="menu-btn">
            Wybierz inne stoisko
          </button>
        </div>

        <div className="menu-item">
          <h3>Sprzedaz calkowita</h3>
          <p>Zobacz wszystkie sprzedaze dla tego stoiska</p>
          <button onClick={handleAllSales} className="menu-btn">
            Pokaz sprzedaz
          </button>
        </div>

        <div className="menu-item">
          <h3>Moja sprzedaz</h3>
          <p>Zobacz swoje sprzedaze</p>
          <button onClick={handleMySales} className="menu-btn">
            Moja sprzedaz
          </button>
        </div>

        <div className="menu-item">
          <h3>Dodaj sprzedaz</h3>
          <p>Dodaj nowa transakcje sprzedazy</p>
          <button onClick={handleAddSale} className="menu-btn primary">
            Dodaj sprzedaz
          </button>
        </div>
      </div>
    </div>
  );
};

export default StallDashboard;
