import React from 'react';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = async (credentialResponse) => {
    // The 'credential' is the secure JWT token from Google
    const token = credentialResponse.credential;

    // Send this token to our Nginx-routed Python backend
    const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
    });

    const data = await response.json();
    if (data.status === "200 OK") {
        setUser(data.user_info);
    } else {
        alert("Authentication failed on backend.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Mavles Production Login</h1>
      
      {!user ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => console.log('Login Failed')}
            />
        </div>
      ) : (
        <div style={{ padding: '20px', border: '2px solid #4CAF50', display: 'inline-block' }}>
          <h3>Welcome, {user.name}!</h3>
          <p>Email: {user.email}</p>
          <img src={user.picture} alt="Profile" style={{ borderRadius: '50%', width: '50px' }} />
        </div>
      )}
    </div>
  );
}

export default App;