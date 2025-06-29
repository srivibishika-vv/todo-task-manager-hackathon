// src/App.jsx
// src/App.jsx
import { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]); // 🆕 task state

  const API_URL = 'https://todo-task-manager-hackathon.onrender.com/api/tasks';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) fetchTasks(); // fetch tasks after login
  }, [user]);

  // 🆕 Fetch tasks from backend
  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('❌ Error fetching tasks:', err.message);
    }
  };

  const handleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        'https://todo-task-manager-hackathon.onrender.com/api/auth/google',
        { token: credentialResponse.credential }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success(`Welcome ${res.data.user.name}`);
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err.message);
      toast.error('Login failed');
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTasks([]); // clear tasks on logout
    toast.info('Logged out');
  };

  return (
    <div style={{ padding: '2rem' }}>
      {!user ? (
        <>
          <h2>Login with Google</h2>
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => toast.error('❌ Google Login Failed')}
          />
        </>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2>Welcome, {user.name}</h2>
            <button onClick={handleLogout}>🚪 Logout</button>
          </div>

          {/* ✅ Pass fetchTasks to reload, and tasks to display */}
          <TaskForm onTaskAdded={fetchTasks} />
          <TaskList tasks={tasks} refreshTasks={fetchTasks} />
        </>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
