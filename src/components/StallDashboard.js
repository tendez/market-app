
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const StallDashboard = () => {
    const { stallId } = useParams();
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const [stall, setStall] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = currentUser?.role === 'admin';

    const fetchStallData = useCallback(async () => {
        try {
            const response = await axios.get(`/api/v1/stoisko/${stallId}`);
            setStall(response.data);
        } catch (error) {
            console.error('Błąd pobierania danych stoiska:', error);
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

    const handleMagazyn = () => {
        navigate(`/stall/${stallId}/magazyn`);
    };

    const handleStatystyki = () => {
        navigate(`/stall/${stallId}/statystyki`);
    };

    if (loading) return <div className="loading">Ładowanie...</div>;

    return (
        <div className="stall-dashboard">
            <div className="dashboard-header">
                <h1>Stoisko: {stall?.nazwa || `Stoisko ${stallId}`}</h1>
                <div className="header-actions">
                    {isAdmin && <span className="admin-badge">👑 Administrator</span>}
                    <button onClick={handleLogout} className="logout-btn">
                        Wyloguj się
                    </button>
                </div>
            </div>

            <div className="dashboard-menu">
                <div className="menu-item">
                    <div className="menu-content">
                        <h3>🔄 Zmiana stoiska</h3>
                        <p>Przejdź do innego stoiska</p>
                    </div>
                    <button onClick={handleChangeStall} className="menu-btn">
                        Wybierz inne stoisko
                    </button>
                </div>

                <div className="menu-item">
                    <div className="menu-content">
                        <h3>📊 Sprzedaż całkowita</h3>
                        <p>Zobacz wszystkie sprzedaże dla tego stoiska</p>
                    </div>
                    <button onClick={handleAllSales} className="menu-btn">
                        Pokaż sprzedaż
                    </button>
                </div>

                <div className="menu-item">
                    <div className="menu-content">
                        <h3>👤 Moja sprzedaż</h3>
                        <p>Zobacz swoje osobiste sprzedaże</p>
                    </div>
                    <button onClick={handleMySales} className="menu-btn">
                        Moja sprzedaż
                    </button>
                </div>

                <div className="menu-item">
                    <div className="menu-content">
                        <h3>➕ Dodaj sprzedaż</h3>
                        <p>Dodaj nową transakcję sprzedaży</p>
                    </div>
                    <button onClick={handleAddSale} className="menu-btn primary">
                        Dodaj sprzedaż
                    </button>
                </div>

                {isAdmin && (
                    <>
                        <div className="menu-item admin-item">
                            <div className="menu-content">
                                <h3>📦 Magazyn</h3>
                                <p>Zarządzaj stanem magazynu dla tego stoiska</p>
                            </div>
                            <button onClick={handleMagazyn} className="menu-btn admin">
                                Zarządzaj magazynem
                            </button>
                        </div>

                        <div className="menu-item admin-item">
                            <div className="menu-content">
                                <h3>📈 Statystyki</h3>
                                <p>Zobacz szczegółowe statystyki sprzedaży</p>
                            </div>
                            <button onClick={handleStatystyki} className="menu-btn admin">
                                Pokaż statystyki
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StallDashboard;
