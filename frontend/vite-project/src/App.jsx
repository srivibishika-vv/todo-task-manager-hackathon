// src/App.jsx
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

import TaskForm from './TaskForm';
import TaskList from './TaskList';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (credentialResponse) => {
    try {
      // Send token to backend to verify and receive JWT and user info
      const res = await axios.post(
        'https://todo-task-manager-hackathon.onrender.com/api/auth/google',
        { token: credentialResponse.credential }
      );

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      toast.success(`Welcome ${res.data.user.name}!`);
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      toast.error('Login failed!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out!');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {!user ? (
        <>
          <h2>Login with Google</h2>
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => toast.error('Google login failed')}
          />
        </>
      ) : (
        <>
          <h2>Welcome, {user.name}!</h2>
          <button
            onClick={handleLogout}
            style={{
              marginBottom: '1rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Logout
          </button>
          <TaskForm onTaskAdded={() => window.location.reload()} />
          <TaskList />
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
