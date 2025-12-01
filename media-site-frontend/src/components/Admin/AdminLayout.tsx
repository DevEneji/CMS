import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        onLogout?.();
        navigate('/admin/login');
    };

    return (
        <div style={layoutStyle}>
            <header style={headerStyle}>
                <h1 style={titleStyle}>Admin Panel</h1>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                    Logout
                </button>
            </header>
            <main style={mainStyle}>
                {children}
            </main>
        </div>
    );
};

const layoutStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
};

const headerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '1rem 2rem',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const titleStyle: React.CSSProperties = {
    margin: 0,
    color: '#333',
};

const logoutButtonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
};

const mainStyle: React.CSSProperties = {
    padding: '0',
};

export default AdminLayout;