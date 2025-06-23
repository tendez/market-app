
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Statystyki = () => {
    const { stallId } = useParams();
    const navigate = useNavigate();
    const [statystyki, setStatystyki] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('stoisko'); // 'stoisko' lub 'ogolne'

    const fetchStatystyki = useCallback(async () => {
        try {
            const endpoint = viewMode === 'stoisko'
                ? `/api/v1/statystyki/stoisko/${stallId}`
                : '/api/v1/statystyki/ogolne';

            const response = await axios.get(endpoint);
            setStatystyki(response.data);
        } catch (error) {
            setError('Błąd pobierania statystyk');
            console.error('Błąd pobierania statystyk:', error);
        } finally {
            setLoading(false);
        }
    }, [stallId, viewMode]);

    useEffect(() => {
        fetchStatystyki();
    }, [fetchStatystyki]);

    const handleBack = () => {
        navigate(`/stall/${stallId}`);
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'stoisko' ? 'ogolne' : 'stoisko');
        setLoading(true);
    };

    if (loading) return <div className="loading">Ładowanie statystyk...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="statystyki">
            <div className="page-header">
                <button onClick={handleBack} className="back-btn">← Powrót</button>
                <h2>📈 Statystyki {viewMode === 'stoisko' ? `- Stoisko ${stallId}` : '- Ogólne'}</h2>
                <button onClick={toggleViewMode} className="toggle-btn">
                    {viewMode === 'stoisko' ? '🌍 Pokaż ogólne' : '🏪 Pokaż stoisko'}
                </button>
            </div>

            <div className="stats-overview">
                <div className="stats-card">
                    <h3>📊 Podsumowanie</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-label">Liczba sprzedaży:</span>
                            <span className="stat-value">{statystyki.liczbaSprzdazy}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Łączna wartość:</span>
                            <span className="stat-value">{statystyki.lacznaWartoscSprzedazy.toFixed(2)} zł</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Średnia cena:</span>
                            <span className="stat-value">{statystyki.sredniaCenaSprzedazy.toFixed(2)} zł</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-sections">
                <div className="stats-section">
                    <h3>🌳 Sprzedaż po gatunkach</h3>
                    <div className="stats-table-container">
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>Gatunek</th>
                                    <th>Liczba sprzedaży</th>
                                    <th>Łączna wartość</th>
                                    <th>% udziału</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statystyki.sprzedazPoGatunku.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.gatunekNazwa}</td>
                                        <td>{item.liczbaSprzdazy}</td>
                                        <td>{item.lacznaWartosc.toFixed(2)} zł</td>
                                        <td>
                                            {((item.lacznaWartosc / statystyki.lacznaWartoscSprzedazy) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="stats-section">
                    <h3>📏 Sprzedaż po rozmiarach</h3>
                    <div className="stats-table-container">
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>Rozmiar</th>
                                    <th>Liczba sprzedaży</th>
                                    <th>Łączna wartość</th>
                                    <th>% udziału</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statystyki.sprzedazPoRozmiarze.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.rozmiarNazwa}</td>
                                        <td>{item.liczbaSprzdazy}</td>
                                        <td>{item.lacznaWartosc.toFixed(2)} zł</td>
                                        <td>
                                            {((item.lacznaWartosc / statystyki.lacznaWartoscSprzedazy) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="stats-section">
                    <h3>📅 Sprzedaż po dniach</h3>
                    <div className="stats-table-container">
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Liczba sprzedaży</th>
                                    <th>Łączna wartość</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statystyki.sprzedazPoDniach
                                    .sort((a, b) => new Date(b.data) - new Date(a.data))
                                    .map((item, index) => (
                                        <tr key={index}>
                                            <td>{new Date(item.data).toLocaleDateString('pl-PL')}</td>
                                            <td>{item.liczbaSprzdazy}</td>
                                            <td>{item.lacznaWartosc.toFixed(2)} zł</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statystyki;
