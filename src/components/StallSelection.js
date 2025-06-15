// src/components/StallSelection.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StallSelection = () => {
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStalls();
  }, []);

  const fetchStalls = async () => {
    try {
      const response = await axios.get('/api/v1/stoisko');
      setStalls(response.data);
    } catch (error) {
      setError('Błąd pobierania stoisk');
      console.error('Błąd pobierania stoisk:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStallSelect = (stallId) => {
    navigate(`/stall/${stallId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) return <div className="loading">Ladowanie stoisk...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="stall-selection">
      <div className="page-header">
        <button onClick={handleBack} className="back-btn">← Powrot</button>
        <h2>Wybor stoiska</h2>
      </div>
      
      <div className="stalls-grid">
        {stalls.map(stall => (
          <div key={stall.stoiskoId} className="stall-card">
            <h3>{stall.nazwa}</h3>
            <button 
              onClick={() => handleStallSelect(stall.stoiskoId)}
              className="select-btn"
            >
              Wybierz stoisko
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StallSelection;
