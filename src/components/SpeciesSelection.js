// src/components/SpeciesSelection.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SpeciesSelection = () => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    try {
      const response = await axios.get('/api/v1/gatunek');
      setSpecies(response.data);
    } catch (error) {
      console.error('Błąd pobierania gatunków:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeciesSelect = (gatunekId) => {
    setSelectedSpecies(gatunekId);
  };

  const handleNext = () => {
    if (selectedSpecies) {
      navigate(`/stall/${stallId}/add-sale/size`, {
        state: { selectedSpecies }
      });
    }
  };

  const handleBack = () => {
    navigate(`/stall/${stallId}`);
  };

  if (loading) return <div className="loading">Ładowanie gatunków...</div>;

  return (
    <div className="species-selection">
      <div className="page-header">
        <button onClick={handleBack} className="back-btn">← Powrót</button>
        <h2>Wybierz gatunek</h2>
      </div>

      <div className="species-grid">
        {species.map(item => (
          <div 
            key={item.gatunekId} 
            className={`species-card ${selectedSpecies === item.gatunekId ? 'selected' : ''}`}
            onClick={() => handleSpeciesSelect(item.gatunekId)}
          >
            <h3>{item.nazwa}</h3>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        <button 
          onClick={handleNext} 
          disabled={!selectedSpecies}
          className="next-btn"
        >
          Dalej →
        </button>
      </div>
    </div>
  );
};

export default SpeciesSelection;
