// src/App.jsx
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskList from './TaskList'; // ⬅️ Add this at the top

// Inside return block, below <TaskForm />
<TaskList />

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// In your JSX return, add at the end
<ToastContainer />


function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        token: credentialResponse.credential
      });

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
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
    </div>
  );
}

export default App;
