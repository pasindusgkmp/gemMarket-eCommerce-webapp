import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Lock, User, ShieldCheck, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const credentials = { username, password };
            const response = isAdminLogin
                ? await authService.adminLogin(credentials)
                : await authService.buyerLogin(credentials);

            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('role', isAdminLogin ? 'ADMIN' : 'BUYER');

            navigate(isAdminLogin ? '/admin' : '/');
        } catch (err) {
            setError(err.response?.data || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ width: '100%', maxWidth: '450px', padding: '40px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access gemMarket</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '12px' }}>
                    <button
                        onClick={() => setIsAdminLogin(false)}
                        className={`btn ${!isAdminLogin ? 'btn-primary' : ''}`}
                        style={{ flex: 1, background: !isAdminLogin ? '' : 'transparent', boxShadow: !isAdminLogin ? '' : 'none' }}
                    >
                        <UserCircle size={18} /> Buyer
                    </button>
                    <button
                        onClick={() => setIsAdminLogin(true)}
                        className={`btn ${isAdminLogin ? 'btn-primary' : ''}`}
                        style={{ flex: 1, background: isAdminLogin ? '' : 'transparent', boxShadow: isAdminLogin ? '' : 'none' }}
                    >
                        <ShieldCheck size={18} /> Admin
                    </button>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                className="input"
                                style={{ paddingLeft: '45px' }}
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="input"
                                style={{ paddingLeft: '45px' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
