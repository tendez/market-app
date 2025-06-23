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
    const [success, setSuccess] = useState('');
    const [speciesName, setSpeciesName] = useState('');
    const [sizeName, setSizeName] = useState('');
    const [stock, setStock] = useState(null);

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

    // Pobierz stan magazynu dla wybranej kombinacji
    const fetchStock = useCallback(async () => {
        try {
            const response = await axios.get(`/api/v1/magazyn/${stallId}`);
            const item = response.data.find(
                m => m.gatunekId === selectedSpecies && m.wielkoscId === selectedSize
            );
            setStock(item ? item.ilosc : 0);
        } catch (error) {
            setStock(null);
        }
    }, [stallId, selectedSpecies, selectedSize]);

    useEffect(() => {
        if (!selectedSpecies || !selectedSize) {
            navigate(`/stall/${stallId}/add-sale/species`);
            return;
        }
        fetchNames();
        fetchStock();
    }, [selectedSpecies, selectedSize, stallId, navigate, fetchNames, fetchStock]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Sprawdź stan magazynu przed próbą sprzedaży
        if (stock === null) {
            setError('Nie można sprawdzić stanu magazynu. Spróbuj ponownie.');
            setLoading(false);
            return;
        }
        if (stock < 1) {
            setError('❌ Brak wybranej choinki w magazynie tego stoiska!');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/v1/sprzedaz', {
                gatunekId: selectedSpecies,
                wielkoscId: selectedSize,
                stoiskoId: parseInt(stallId),
                cena: parseInt(price)
            });

            setSuccess(`✅ Świetnie! Sprzedaż została pomyślnie dodana do systemu.`);
            setTimeout(() => {
                navigate(`/stall/${stallId}`);
            }, 2000);

        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message &&
                error.response.data.message.includes('magazynie')
            ) {
                setError('❌ Brak wybranej choinki w magazynie!');
            } else {
                setError('❌ Ups! Wystąpił problem podczas dodawania sprzedaży. Spróbuj ponownie.');
            }
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
                    <p>
                        <strong>Dostępne w magazynie:</strong>{' '}
                        {stock === null ? '...' : stock}
                    </p>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

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
                            disabled={loading || success}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !price || success}
                        className="submit-btn"
                    >
                        {loading ? '⏳ Dodawanie...' : success ? '✅ Dodano!' : '💰 Dodaj sprzedaż'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PriceSelection;
