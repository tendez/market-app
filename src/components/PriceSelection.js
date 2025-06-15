// src/components/PriceSelection.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PriceSelection = () => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [speciesName, setSpeciesName] = useState('');
  const [sizeName, setSizeName] = useState('');

  const selectedSpecies = location.state?.selectedSpecies;
  const selectedSize = location.state?.selectedSize;

  const fetchNames = useCallback(async () => {
    try {
      const [speciesResponse, sizeResponse] = await Promise.all([
        axios.get(`/api/v1/gatunek/${selectedSpecies}`),
        axios.get(`/api/v1/wielkosc/${selectedSize}`)
      ]);
      setSpeciesName(speciesResponse.data.nazwa);
      setSizeName(sizeResponse.data.nazwa);
    } catch (error) {
      console.error('Błąd pobierania nazw:', error);
    }
  }, [selectedSpecies, selectedSize]);

  useEffect(() => {
    if (!selectedSpecies || !selectedSize) {
      navigate(`/stall/${stallId}/add-sale/species`);
      return;
    }
    fetchNames();
  }, [selectedSpecies, selectedSize, stallId, navigate, fetchNames]);

  // Reszta komponentu pozostaje bez zmian...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/v1/sprzedaz', {
        gatunekId: selectedSpecies,
        wielkoscId: selectedSize,
        stoiskoId: parseInt(stallId),
        cena: parseInt(price)
      });

      alert('Sprzedaż została pomyślnie dodana!');
      navigate(`/stall/${stallId}`);
    } catch (error) {
      setError('Błąd podczas dodawania sprzedaży');
      console.error('Błąd dodawania sprzedaży:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/stall/${stallId}/add-sale/size`, {
      state: { selectedSpecies }
    });
  };

  return (
    <div className="price-selection">
      <div className="page-header">
        <button onClick={handleBack} className="back-btn">← Powrót</button>
        <h2>Ustaw cenę</h2>
      </div>

      <div className="price-form-container">
        <div className="summary">
          <h3>Podsumowanie:</h3>
          <p><strong>Gatunek:</strong> {speciesName || `ID: ${selectedSpecies}`}</p>
          <p><strong>Rozmiar:</strong> {sizeName || `ID: ${selectedSize}`}</p>
          <p><strong>Stoisko ID:</strong> {stallId}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="price-form">
          <div className="form-group">
            <label>Cena (zł):</label>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="Wprowadź cenę"
            />
          </div>
          
          <button type="submit" disabled={loading || !price} className="submit-btn">
            {loading ? 'Dodawanie...' : 'Dodaj sprzedaż'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PriceSelection;
