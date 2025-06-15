// src/components/SizeSelection.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SizeSelection = () => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const selectedSpecies = location.state?.selectedSpecies;

  useEffect(() => {
    if (!selectedSpecies) {
      navigate(`/stall/${stallId}/add-sale/species`);
      return;
    }
    fetchSizes();
  }, [selectedSpecies, stallId, navigate]);

  const fetchSizes = async () => {
    try {
      const response = await axios.get('/api/v1/wielkosc');
      setSizes(response.data);
    } catch (error) {
      console.error('Błąd pobierania rozmiarów:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSizeSelect = (wielkoscId) => {
    setSelectedSize(wielkoscId);
  };

  const handleNext = () => {
    if (selectedSize) {
      navigate(`/stall/${stallId}/add-sale/price`, {
        state: { 
          selectedSpecies,
          selectedSize 
        }
      });
    }
  };

  const handleBack = () => {
    navigate(`/stall/${stallId}/add-sale/species`);
  };

  if (loading) return <div className="loading">Ładowanie rozmiarów...</div>;

  return (
    <div className="size-selection">
      <div className="page-header">
        <button onClick={handleBack} className="back-btn">← Powrót</button>
        <h2>Wybierz rozmiar</h2>
      </div>

      <div className="size-grid">
        {sizes.map(item => (
          <div 
            key={item.wielkoscId} 
            className={`size-card ${selectedSize === item.wielkoscId ? 'selected' : ''}`}
            onClick={() => handleSizeSelect(item.wielkoscId)}
          >
            <h3>{item.nazwa}</h3>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        <button 
          onClick={handleNext} 
          disabled={!selectedSize}
          className="next-btn"
        >
          Dalej →
        </button>
      </div>
    </div>
  );
};

export default SizeSelection;
