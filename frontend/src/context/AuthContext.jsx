import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const verifyEmail = async (email, code) => {
        const { data } = await api.post('/auth/verify', { email, code });
        if (data.isVerified) {
            const updatedUser = { ...user, isVerified: true };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        }
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, verifyEmail }}>
            {children}
        </AuthContext.Provider>
    );
};
