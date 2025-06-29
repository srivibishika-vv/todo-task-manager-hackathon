import { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [filter, setFilter] = useState('all');

  const API_URL = 'https://todo-task-manager-hackathon.onrender.com/api/tasks';

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(API_URL, {
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
      await axios.delete(`${API_URL}/${id}`, {
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
        `${API_URL}/${task._id}`,
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
    setEditDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
  };

  const submitEdit = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        `${API_URL}/${id}`,
        {
          title: editTitle,
          dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
      setEditTaskId(null);
      setEditTitle('');
      setEditDueDate('');
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
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  style={{ marginLeft: '10px' }}
                />
                <button onClick={() => submitEdit(task._id)}>💾 Save</button>
                <button onClick={() => setEditTaskId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    marginRight: '10px',
                  }}
                >
                  {task.title}
                </span>
                {task.dueDate && (
                  <span style={{ color: '#888', marginRight: '10px' }}>
                    🗓 {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
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
