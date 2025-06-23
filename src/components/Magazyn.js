
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Magazyn = () => {
    const { stallId } = useParams();
    const navigate = useNavigate();
    const [magazyn, setMagazyn] = useState([]);
    const [gatunki, setGatunki] = useState([]);
    const [wielkosci, setWielkosci] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        gatunekId: '',
        wielkoscId: '',
        ilosc: ''
    });

    const fetchData = useCallback(async () => {
        try {
            const [magazynResponse, gatunkiResponse, wielkosciResponse] = await Promise.all([
                axios.get(`/api/v1/magazyn/${stallId}`),
                axios.get('/api/v1/gatunek'),
                axios.get('/api/v1/wielkosc')
            ]);

            setMagazyn(magazynResponse.data);
            setGatunki(gatunkiResponse.data);
            setWielkosci(wielkosciResponse.data);
        } catch (error) {
            setError('Błąd pobierania danych magazynu');
            console.error('Błąd pobierania danych:', error);
        } finally {
            setLoading(false);
        }
    }, [stallId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBack = () => {
        navigate(`/stall/${stallId}`);
    };

    const handleUpdate = async (magazynId, newIlosc, operation) => {
        try {
            const magazynItem = magazyn.find(m => m.magazynId === magazynId);

            const endpoint = operation === 'add' ? '/api/v1/magazyn/add' : '/api/v1/magazyn/subtract';

            await axios.post(endpoint, {
                stoiskoId: parseInt(stallId),
                gatunekId: magazynItem.gatunekId,
                wielkoscId: magazynItem.wielkoscId,
                ilosc: parseInt(newIlosc)
            });

            setSuccess(`✅ Pomyślnie ${operation === 'add' ? 'dodano' : 'odjęto'} ${newIlosc} sztuk!`);
            fetchData();

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('❌ Błąd podczas aktualizacji magazynu');
            console.error('Błąd aktualizacji:', error);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleAddNew = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/v1/magazyn/add', {
                stoiskoId: parseInt(stallId),
                gatunekId: parseInt(formData.gatunekId),
                wielkoscId: parseInt(formData.wielkoscId),
                ilosc: parseInt(formData.ilosc)
            });

            setSuccess('✅ Pomyślnie dodano nową pozycję do magazynu!');
            setShowAddForm(false);
            setFormData({ gatunekId: '', wielkoscId: '', ilosc: '' });
            fetchData();

            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError('❌ Błąd podczas dodawania pozycji');
            console.error('Błąd dodawania:', error);
            setTimeout(() => setError(''), 3000);
        }
    };

    const getGatunekNazwa = (id) => {
        const gatunek = gatunki.find(g => g.gatunekId === id);
        return gatunek ? gatunek.nazwa : `ID: ${id}`;
    };

    const getWielkoscNazwa = (id) => {
        const wielkosc = wielkosci.find(w => w.wielkoscId === id);
        return wielkosc ? wielkosc.nazwa : `ID: ${id}`;
    };

    if (loading) return <div className="loading">Ładowanie magazynu...</div>;

    return (
        <div className="magazyn">
            <div className="page-header">
                <button onClick={handleBack} className="back-btn">← Powrót</button>
                <h2>📦 Magazyn - Stoisko {stallId}</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="add-btn"
                >
                    {showAddForm ? '✕ Anuluj' : '➕ Dodaj pozycję'}
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {showAddForm && (
                <div className="add-form-container">
                    <h3>Dodaj nową pozycję do magazynu</h3>
                    <form onSubmit={handleAddNew} className="add-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Gatunek:</label>
                                <select
                                    value={formData.gatunekId}
                                    onChange={(e) => setFormData({ ...formData, gatunekId: e.target.value })}
                                    required
                                >
                                    <option value="">Wybierz gatunek</option>
                                    {gatunki.map(gatunek => (
                                        <option key={gatunek.gatunekId} value={gatunek.gatunekId}>
                                            {gatunek.nazwa}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Rozmiar:</label>
                                <select
                                    value={formData.wielkoscId}
                                    onChange={(e) => setFormData({ ...formData, wielkoscId: e.target.value })}
                                    required
                                >
                                    <option value="">Wybierz rozmiar</option>
                                    {wielkosci.map(wielkosc => (
                                        <option key={wielkosc.wielkoscId} value={wielkosc.wielkoscId}>
                                            {wielkosc.nazwa}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Ilość:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.ilosc}
                                    onChange={(e) => setFormData({ ...formData, ilosc: e.target.value })}
                                    required
                                    placeholder="Wprowadź ilość"
                                />
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">
                            Dodaj do magazynu
                        </button>
                    </form>
                </div>
            )}

            <div className="magazyn-table-container">
                <table className="magazyn-table">
                    <thead>
                        <tr>
                            <th>Gatunek</th>
                            <th>Rozmiar</th>
                            <th>Ilość w magazynie</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {magazyn.map(item => (
                            <MagazynRow
                                key={item.magazynId}
                                item={item}
                                gatunekNazwa={getGatunekNazwa(item.gatunekId)}
                                wielkoscNazwa={getWielkoscNazwa(item.wielkoscId)}
                                onUpdate={handleUpdate}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {magazyn.length === 0 && (
                <div className="no-data">
                    <p>Brak pozycji w magazynie dla tego stoiska</p>
                </div>
            )}
        </div>
    );
};

const MagazynRow = ({ item, gatunekNazwa, wielkoscNazwa, onUpdate }) => {
    const [showActions, setShowActions] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue && parseInt(inputValue) > 0) {
            onUpdate(item.magazynId, inputValue, 'add');
            setInputValue('');
            setShowActions(false);
        }
    };

    const handleSubtract = () => {
        if (inputValue && parseInt(inputValue) > 0) {
            onUpdate(item.magazynId, inputValue, 'subtract');
            setInputValue('');
            setShowActions(false);
        }
    };

    return (
        <tr>
            <td>{gatunekNazwa}</td>
            <td>{wielkoscNazwa}</td>
            <td className="ilosc-cell">
                <span className={`ilosc-badge ${item.ilosc === 0 ? 'empty' : item.ilosc < 10 ? 'low' : 'good'}`}>
                    {item.ilosc} szt.
                </span>
            </td>
            <td>
                {!showActions ? (
                    <button
                        onClick={() => setShowActions(true)}
                        className="action-btn"
                    >
                        ⚙️ Zarządzaj
                    </button>
                ) : (
                    <div className="action-controls">
                        <input
                            type="number"
                            min="1"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ilość"
                            className="action-input"
                        />
                        <button onClick={handleAdd} className="add-action-btn" title="Dodaj">
                            ➕
                        </button>
                        <button onClick={handleSubtract} className="subtract-action-btn" title="Odejmij">
                            ➖
                        </button>
                        <button onClick={() => setShowActions(false)} className="cancel-action-btn" title="Anuluj">
                            ✕
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default Magazyn;
