import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gem, LogOut, LayoutDashboard, User, Trophy } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = localStorage.getItem('role') === 'ADMIN';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '20px', zIndex: 1000 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
                <Gem size={32} color="#c4a1ff" />
                <span style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }} className="text-gradient">gemMarket</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/winners" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Trophy size={18} /> Winners
                </Link>

                {user ? (
                    <>
                        {isAdmin ? (
                            <Link to="/admin" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <LayoutDashboard size={18} /> Admin Panel
                            </Link>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                                <User size={18} /> <span>{user.name}</span>
                            </div>
                        )}
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 15px' }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary">Login</Link>
                )}
            </div>

            <style>{`
                .nav-link {
                    text-decoration: none;
                    color: var(--text-muted);
                    font-weight: 500;
                    transition: color 0.3s;
                }
                .nav-link:hover {
                    color: var(--primary);
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
