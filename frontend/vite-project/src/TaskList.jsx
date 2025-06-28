import { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, incomplete

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
    }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err.message);
    }
  };

  const toggleComplete = async (task) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error('Error updating task:', err.message);
    }
  };

  const startEdit = (task) => {
    setEditTaskId(task._id);
    setEditTitle(task.title);
  };

  const submitEdit = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { title: editTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      setEditTaskId(null);
      setEditTitle('');
    } catch (err) {
      console.error('Error editing task:', err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  return (
    <div>
      <h3>Your Tasks</h3>

      {/* Filter Buttons */}
      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setFilter('all')}>📋 All</button>
        <button onClick={() => setFilter('completed')}>✅ Completed</button>
        <button onClick={() => setFilter('incomplete')}>🕓 Incomplete</button>
      </div>

      {filteredTasks.length === 0 && <p>No tasks found.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map((task) => (
          <li key={task._id} style={{ marginBottom: '10px' }}>
            {editTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => submitEdit(task._id)}>💾 Save</button>
                <button onClick={() => setEditTaskId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <span style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  marginRight: '10px'
                }}>
                  {task.title}
                </span>
                <button onClick={() => toggleComplete(task)}>
                  {task.completed ? '✅ Undo' : '✔️ Done'}
                </button>
                <button onClick={() => startEdit(task)} style={{ marginLeft: '5px' }}>
                  ✏️ Edit
                </button>
                <button onClick={() => deleteTask(task._id)} style={{ marginLeft: '5px' }}>
                  ❌ Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
