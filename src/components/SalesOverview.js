// src/components/SalesOverview.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SalesOverview = () => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useDetails, setUseDetails] = useState(false);

  const fetchSales = useCallback(async () => {
    try {
      const endpoint = useDetails 
        ? `/api/v1/sprzedaz/details/bystoiskoid/${stallId}`
        : `/api/v1/sprzedaz/bystoiskoid/${stallId}`;
      const response = await axios.get(endpoint);
      setSales(response.data);
    } catch (error) {
      setError('Błąd pobierania sprzedaży');
      console.error('Błąd pobierania sprzedaży:', error);
    } finally {
      setLoading(false);
    }
  }, [stallId, useDetails]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleBack = () => {
    navigate(`/stall/${stallId}`);
  };

  const calculateTotal = () => {
    return sales.reduce((total, sale) => total + (sale.cena || 0), 0);
  };

  const toggleDetails = () => {
    setUseDetails(!useDetails);
    setLoading(true);
  };

  if (loading) return <div className="loading">Ładowanie sprzedaży...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="sales-overview">
      <div className="page-header">
        <button onClick={handleBack} className="back-btn">← Powrót</button>
        <h2>Sprzedaż całkowita - Stoisko {stallId}</h2>
        <button onClick={toggleDetails} className="toggle-btn">
          {useDetails ? 'Pokaż ID' : 'Pokaż nazwy'}
        </button>
      </div>

      <div className="sales-summary">
        <div className="summary-card">
          <h3>Podsumowanie</h3>
          <p>Liczba transakcji: {sales.length}</p>
          <p>Łączna wartość: {calculateTotal()} zł</p>
        </div>
      </div>

      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID Sprzedaży</th>
              <th>Gatunek</th>
              <th>Rozmiar</th>
              {useDetails && <th>Stoisko</th>}
              <th>Użytkownik</th>
              <th>Cena</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.sprzedazId}>
                <td>{sale.sprzedazId}</td>
                <td>{useDetails ? sale.gatunekNazwa : sale.gatunekId}</td>
                <td>{useDetails ? sale.wielkoscNazwa : sale.wielkoscId}</td>
                {useDetails && <td>{sale.stoiskoNazwa}</td>}
                <td>{useDetails ? sale.uzytkownikLogin : sale.uzytkownikId}</td>
                <td>{sale.cena} zł</td>
                <td>{sale.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sales.length === 0 && (
        <div className="no-data">
          <p>Brak sprzedaży dla tego stoiska</p>
        </div>
      )}
    </div>
  );
};

export default SalesOverview;
