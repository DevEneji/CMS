import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/api';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: ''});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // If already logged in, redirect to dashboard
    if (authService.isAuthenticated()) {
        console.log('Already authenticated, redirecting to dashboard');
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Attempting login with:', credentials);
            const tokens = await authService.login(credentials);
            console.log('Login successful, tokens received:', tokens);
            
            // Verify tokens are stored
            console.log('Stored access token:', localStorage.getItem('access_token'));
            console.log('Stored refresh token:', localStorage.getItem('refresh_token'));
            console.log('isAuthenticated check:', authService.isAuthenticated());
            
            onLogin(); // Notify App component
        } catch (err: any) {
            console.error('Login error:', err);
            console.error('Error response:', err.response?.data);
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={loginContainerStyle}>
            <div style={containerStyle}>
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        style={inputStyle}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        style={inputStyle}
                        required
                    />
                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p style={errorStyle}>{error}</p>}
                </form>
            </div>
        </div>
    );
};

const loginContainerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
};

const containerStyle: React.CSSProperties = {
    maxWidth: '400px',
    margin: '2rem',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
};

const inputStyle: React.CSSProperties = {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
};

const buttonStyle: React.CSSProperties = {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
};

const errorStyle: React.CSSProperties = {
    color: 'red',
    textAlign: 'center',
    margin: 0,
};

export default Login;