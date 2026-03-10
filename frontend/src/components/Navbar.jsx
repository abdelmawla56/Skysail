import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, User, LogOut, History, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass-nav">
            <div className="container" style={{ height: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'white', fontSize: '1.5rem', fontWeight: '700' }}>
                    <Plane className="text-primary" style={{ color: '#6366f1' }} />
                    <span>Skysail</span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {user ? (
                        <>
                            <Link to="/" className="text-muted" style={{ textDecoration: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Search size={18} /> Search
                            </Link>
                            <Link to="/bookings" className="text-muted" style={{ textDecoration: 'none', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <History size={18} /> My Bookings
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.isVerified ? 'Verified' : 'Unverified'}</span>
                                </div>
                                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-muted" style={{ textDecoration: 'none', color: '#94a3b8' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
