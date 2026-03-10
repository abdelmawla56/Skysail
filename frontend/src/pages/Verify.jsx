import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Verify = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { verifyEmail, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.isVerified) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            setError('Code must be 6 digits');
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            await verifyEmail(user.email, code);
            setSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '1rem', color: '#6366f1', marginBottom: '1.5rem' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Verify Your Email</h1>
                    <p style={{ color: '#94a3b8' }}>Please enter the 6-digit code sent to your email</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid #f43f5e', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#f43f5e' }}>
                        <AlertCircle size={20} />
                        <span style={{ fontSize: '0.875rem' }}>{error}</span>
                    </div>
                )}

                {success && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#10b981' }}>
                        <CheckCircle size={20} />
                        <span style={{ fontSize: '0.875rem' }}>Email verified! Redirecting to dashboard...</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label" style={{ textAlign: 'center' }}>Verification Code</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            required
                            style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5rem', fontWeight: '700' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={isSubmitting || success}>
                        {isSubmitting ? <div className="loading-spinner" style={{ width: '1.25rem', height: '1.25rem' }} /> : 'VERIFY CODE'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                    Didn't receive the code? Check your spam folder.
                </p>
            </div>
        </div>
    );
};

export default Verify;
