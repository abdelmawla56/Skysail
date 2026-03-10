import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (!user.isVerified) {
                navigate('/verify');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: '#94a3b8' }}>Login to access your premium flight experience</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#f43f5e' }}>
                        <AlertCircle size={20} />
                        <span style={{ fontSize: '0.875rem' }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ paddingLeft: '2.75rem' }}
                            />
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingLeft: '2.75rem' }}
                            />
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting}>
                        {isSubmitting ? <div className="loading-spinner" style={{ width: '1.25rem', height: '1.25rem' }} /> : (
                            <>
                                <LogIn size={20} /> SIGN IN
                            </>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem', color: '#94a3b8' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: '600' }}>Register now</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
