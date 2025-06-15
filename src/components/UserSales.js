// src/components/UserSales.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const UserSales = () => {
  const { stallId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useDetails, setUseDetails] = useState(false);

  const fetchUserSales = useCallback(async () => {
    if (!currentUser?.uzytkownikId) return;
    
    try {
      const endpoint = useDetails 
        ? `/api/v1/sprzedaz/details/byuserid/${currentUser.uzytkownikId}`
        : `/api/v1/sprzedaz/byuserid/${currentUser.uzytkownikId}`;
      const response = await axios.get(endpoint);
      setSales(response.data);
    } catch (error) {
      setError('Błąd pobierania sprzedaży użytkownika');
      console.error('Błąd pobierania sprzedaży użytkownika:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uzytkownikId, useDetails]);

  useEffect(() => {
    fetchUserSales();
  }, [fetchUserSales]);

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

  if (loading) return <div className="loading">Ladowanie sprzedazy...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-sales">
      <div className="page-header">
        <button onClick={handleBack} className="back-btn">← Powrot</button>
        <h2>Moja sprzedaz - {currentUser?.login}</h2>
        <button onClick={toggleDetails} className="toggle-btn">
          {useDetails ? 'Pokaż ID' : 'Pokaż nazwy'}
        </button>
      </div>

      <div className="sales-summary">
        <div className="summary-card">
          <h3>Podsumowanie</h3>
          <p>Liczba moich transakcji: {sales.length}</p>
          <p>laczna wartosc: {calculateTotal()} zl</p>
        </div>
      </div>

      <div className="sales-table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID Sprzedazy</th>
              <th>Gatunek</th>
              <th>Rozmiar</th>
              <th>Stoisko</th>
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
                <td>{useDetails ? sale.stoiskoNazwa : sale.stoiskoId}</td>
                <td>{sale.cena} zł</td>
                <td>{sale.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sales.length === 0 && (
        <div className="no-data">
          <p>Nie masz jeszcze zadnych sprzedazy</p>
        </div>
      )}
    </div>
  );
};

export default UserSales;
