import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import MyBookings from './pages/MyBookings';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app">
                    <Navbar />
                    <main>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Semi-Protected Route (Requires Login but not necessarily verified) */}
                            <Route
                                path="/verify"
                                element={
                                    <ProtectedRoute>
                                        <Verify />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Protected Routes (Require Login) */}
                            <Route
                                path="/bookings"
                                element={
                                    <ProtectedRoute>
                                        <MyBookings />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
