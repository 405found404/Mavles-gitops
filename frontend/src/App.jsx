import React from 'react';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = credentialResponse.credential;
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
      });

      const data = await response.json();
      if (data.status === "200 OK") {
        setUser(data.user_info);
      } else {
        setError("Authentication failed. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <div className="app-container">
      {/* Background Elements */}
      <div className="background-gradient"></div>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {!user ? (
          <>
            {/* Login Screen */}
            <div className="login-container">
              <div className="logo-section">
                <div className="logo-icon">🚀</div>
                <h1 className="brand-title">Mavles</h1>
                <p className="brand-subtitle">Production Dashboard</p>
              </div>

              <div className="login-card">
                <div className="login-header">
                  <h2>Welcome Back</h2>
                  <p>Sign in to your account to continue</p>
                </div>

                {error && (
                  <div className="error-message">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <div className="login-button-wrapper">
                  {loading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <p>Signing in...</p>
                    </div>
                  ) : (
                    <>
                      <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => setError('Google sign-in failed')}
                      />
                      <p className="login-footer">
                        We never store your password. Secure login with Google.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="features">
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Secure</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Fast</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <span>Modern</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Dashboard Screen */}
            <div className="dashboard-container">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>

              <div className="welcome-card">
                <div className="profile-header">
                  <div className="profile-image-wrapper">
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="profile-image"
                    />
                    <div className="online-badge"></div>
                  </div>
                </div>

                <div className="profile-info">
                  <h2 className="welcome-title">Welcome, {user.name}! 👋</h2>
                  <p className="profile-email">{user.email}</p>

                  <div className="profile-stats">
                    <div className="stat">
                      <div className="stat-value">Active</div>
                      <div className="stat-label">Status</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">Today</div>
                      <div className="stat-label">Session</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">✓</div>
                      <div className="stat-label">Verified</div>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="action-btn primary">
                    📊 Dashboard
                  </button>
                  <button className="action-btn secondary">
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;