import React, { useState, useEffect } from 'react';
import { History, Plane, Calendar, XCircle, Info, Clock, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        setCancelLoading(bookingId);
        try {
            await api.put(`/bookings/${bookingId}`, { status: 'canceled' });
            // Refresh bookings
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.message || 'Cancellation failed');
        } finally {
            setCancelLoading(null);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '1rem', color: '#6366f1' }}>
                    <History size={32} />
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Your Booking History</h1>
                    <p style={{ color: '#94a3b8' }}>Review and manage your past and upcoming flights</p>
                </div>
            </header>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div className="loading-spinner" style={{ width: '3rem', height: '3rem' }}></div>
                </div>
            ) : bookings.length > 0 ? (
                <div className="grid grid-cols-2">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="glass fade-in" style={{ padding: '2rem', position: 'relative', opacity: booking.status === 'canceled' ? 0.7 : 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Plane size={24} style={{ color: '#6366f1' }} />
                                    <div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{booking.flightId?.from} → {booking.flightId?.to}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Flight #{booking.flightId?.flightNumber || 'N/A'}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '50px',
                                        background: booking.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                        color: booking.status === 'confirmed' ? '#10b981' : '#f43f5e',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        {booking.status === 'confirmed' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                        {booking.status}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}>
                                    <Calendar size={18} style={{ color: '#8b5cf6' }} />
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Departure Date</div>
                                        <div style={{ fontWeight: '600' }}>{booking.flightId ? new Date(booking.flightId.date).toLocaleDateString() : 'N/A'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}>
                                    <Clock size={18} style={{ color: '#f59e0b' }} />
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Booking Time</div>
                                        <div style={{ fontWeight: '600' }}>{new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Price ({booking.numSeats} Seat)</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f8fafc' }}>${booking.totalPrice}</div>
                                </div>
                                {booking.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleCancel(booking._id)}
                                        className="btn btn-secondary"
                                        style={{ color: '#f43f5e', borderColor: '#f43f5e' }}
                                        disabled={cancelLoading === booking._id}
                                    >
                                        {cancelLoading === booking._id ? <div className="loading-spinner" style={{ width: '1.25rem', height: '1.25rem' }} /> : (
                                            <>
                                                <XCircle size={18} /> CANCEL
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '8rem', color: '#94a3b8' }}>
                    <Info size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.25rem' }}>You haven't booked any flights yet</p>
                    <button onClick={() => window.location.href = '/'} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Explore Flights</button>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
