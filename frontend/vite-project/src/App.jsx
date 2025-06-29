// src/App.jsx
// src/App.jsx
import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post('https://todo-task-manager-hackathon.onrender.com/api/auth/google', {
        token: credentialResponse.credential,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success(`Welcome ${res.data.user.name}`);
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      toast.error("Login failed");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {!user ? (
        <>
          <h2>Login with Google</h2>
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => console.log("❌ Google Login Failed")}
          />
        </>
      ) : (
        <>
          <h2>Welcome, {user.name}</h2>
          <TaskForm onTaskAdded={() => window.location.reload()} />
          <TaskList />
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
