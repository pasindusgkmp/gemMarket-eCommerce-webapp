import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import WinnersPage from './pages/WinnersPage';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = localStorage.getItem('role');

  if (!user) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/winners" element={<WinnersPage />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="ADMIN">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        <footer style={{ padding: '40px', textAlign: 'center', borderTop: '1px solid var(--glass-border)', marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          &copy; 2026 gemMarket Premium. All rights reserved. Handcrafted for excellence.
        </footer>
      </div>
    </Router>
  );
}

export default App;
