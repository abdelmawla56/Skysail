import React, { useState, useEffect, useContext } from 'react';
import { Search, MapPin, Calendar, PlaneTakeoff, Info } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { user } = useContext(AuthContext);

    const fetchFlights = async (isSearch = false) => {
        setLoading(true);
        try {
            let url = '/flights';
            if (isSearch) {
                url = `/flights/search?from=${from}&to=${to}&date=${date}`;
            }
            const { data } = await api.get(url);
            setFlights(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFlights(true);
    };

    const handleBooking = async (flightId) => {
        if (!user) {
            setMessage({ type: 'error', text: 'Please login to book a flight' });
            return;
        }
        if (!user.isVerified) {
            setMessage({ type: 'error', text: 'Please verify your email to book a flight' });
            return;
        }

        setBookingLoading(flightId);
        try {
            await api.post('/bookings', { flightId, numSeats: 1 });
            setMessage({ type: 'success', text: 'Flight booked successfully!' });
            // Refresh flights to show updated seat count
            fetchFlights(from || to || date);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Booking failed' });
        } finally {
            setBookingLoading(null);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            {/* Hero / Search Section */}
            <section className="glass fade-in" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '2rem', textAlign: 'center' }}>
                    Find Your Next <span style={{ color: '#6366f1' }}>Adventure</span>
                </h1>

                <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">From</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Departure City"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <MapPin size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#6366f1' }} />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">To</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Destination"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <MapPin size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#f43f5e' }} />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Departure Date</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="date"
                                className="input-field"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <Calendar size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#8b5cf6' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem' }}>
                        <Search size={20} /> SEARCH
                    </button>
                </form>
            </section>

            {message.text && (
                <div className={`fade-in`} style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                    color: message.type === 'success' ? '#10b981' : '#f43f5e',
                    border: `1px solid ${message.type === 'success' ? '#10b981' : '#f43f5e'}`
                }}>
                    {message.text}
                </div>
            )}

            {/* Flight Results */}
            <div className="grid grid-cols-3">
                {loading ? (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <div className="loading-spinner" style={{ width: '3rem', height: '3rem' }}></div>
                    </div>
                ) : (Array.isArray(flights) && flights.length > 0) ? (
                    flights.map((flight) => (
                        <div key={flight._id} className="glass fade-in" style={{ padding: '1.5rem', transition: 'transform 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                                    {flight.flightNumber}
                                </div>
                                <div style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Calendar size={14} /> {new Date(flight.date).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{flight.from}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Departure</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                    <PlaneTakeoff size={18} style={{ color: '#6366f1' }} />
                                    <div style={{ width: '40px', height: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                                </div>
                                <div style={{ flex: 1, textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{flight.to}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Arrival</div>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>${flight.price}</div>
                                    <div style={{ fontSize: '0.75rem', color: flight.availableSeats < 10 ? '#f43f5e' : '#94a3b8' }}>
                                        {flight.availableSeats} seats left
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleBooking(flight._id)}
                                    className="btn btn-primary"
                                    disabled={flight.availableSeats === 0 || bookingLoading === flight._id}
                                >
                                    {bookingLoading === flight._id ? <div className="loading-spinner" style={{ width: '1rem', height: '1rem' }} /> : (flight.availableSeats === 0 ? 'Full' : 'BOOK')}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                        <Info size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No flights found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
