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
    const [filteredSales, setFilteredSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [useDetails, setUseDetails] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableDates, setAvailableDates] = useState([]);
    const [showDateFilter, setShowDateFilter] = useState(false);

    const fetchUserSales = useCallback(async () => {
        if (!currentUser?.uzytkownikId) return;

        try {
            const endpoint = useDetails
                ? `/api/v1/sprzedaz/details/byuserid/${currentUser.uzytkownikId}`
                : `/api/v1/sprzedaz/byuserid/${currentUser.uzytkownikId}`;
            const response = await axios.get(endpoint);

            // Sortuj od najnowszej daty
            const sortedSales = response.data.sort((a, b) => {
                const dateA = new Date(a.data);
                const dateB = new Date(b.data);
                return dateB - dateA;
            });

            setSales(sortedSales);
            setFilteredSales(sortedSales);

            // Wyciągnij unikalne daty
            const dates = [...new Set(sortedSales.map(sale => sale.data.split(' ')[0]))];
            setAvailableDates(dates.sort((a, b) => new Date(b) - new Date(a)));
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

    // Filtrowanie po dacie
    useEffect(() => {
        if (selectedDate) {
            const filtered = sales.filter(sale => {
                const saleDate = sale.data.split(' ')[0];
                return saleDate === selectedDate;
            });
            setFilteredSales(filtered);
        } else {
            setFilteredSales(sales);
        }
    }, [selectedDate, sales]);

    const handleBack = () => {
        navigate(`/stall/${stallId}`);
    };

    const calculateTotal = () => {
        return filteredSales.reduce((total, sale) => total + (sale.cena || 0), 0);
    };

    const toggleDetails = () => {
        setUseDetails(!useDetails);
        setLoading(true);
    };

    const handleDateHeaderClick = () => {
        setShowDateFilter(!showDateFilter);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowDateFilter(false);
    };

    const clearDateFilter = () => {
        setSelectedDate('');
        setShowDateFilter(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL');
    };

    if (loading) return <div className="loading">Ładowanie sprzedaży...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="user-sales">
            <div className="page-header">
                <button onClick={handleBack} className="back-btn">← Powrót</button>
                <h2>Moja sprzedaż - {currentUser?.login}</h2>
                <button onClick={toggleDetails} className="toggle-btn">
                    {useDetails ? 'Pokaż ID' : 'Pokaż nazwy'}
                </button>
            </div>

            <div className="sales-summary">
                <div className="summary-card">
                    <h3>Podsumowanie</h3>
                    <p>Liczba moich transakcji: {filteredSales.length}</p>
                    <p>Łączna wartość: {calculateTotal()} zł</p>
                    {selectedDate && (
                        <div className="date-filter-info">
                            <span>Filtr daty: {formatDate(selectedDate)}</span>
                            <button onClick={clearDateFilter} className="clear-filter-btn">
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="sales-table-container">
                <table className="sales-table">
                    <thead>
                        <tr>
                            <th>ID Sprzedaży</th>
                            <th>Gatunek</th>
                            <th>Rozmiar</th>
                            <th>Stoisko</th>
                            <th>Cena</th>
                            <th
                                className="date-header clickable"
                                onClick={handleDateHeaderClick}
                                title="Kliknij aby filtrować po dacie"
                            >
                                Data 📅
                                {showDateFilter && (
                                    <div className="simple-date-picker">
                                        <div className="date-picker-header">
                                            <span>Wybierz datę:</span>
                                            <button onClick={clearDateFilter} className="close-picker-btn">✕</button>
                                        </div>
                                        <div className="date-options">
                                            {availableDates.map(date => (
                                                <button
                                                    key={date}
                                                    className={`date-option ${selectedDate === date ? 'selected' : ''}`}
                                                    onClick={() => handleDateSelect(date)}
                                                >
                                                    {formatDate(date)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSales.map(sale => (
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

            {filteredSales.length === 0 && selectedDate && (
                <div className="no-data">
                    <p>Brak sprzedaży dla wybranej daty: {formatDate(selectedDate)}</p>
                </div>
            )}

            {filteredSales.length === 0 && !selectedDate && (
                <div className="no-data">
                    <p>Nie masz jeszcze żadnych sprzedaży</p>
                </div>
            )}
        </div>
    );
};

export default UserSales;
