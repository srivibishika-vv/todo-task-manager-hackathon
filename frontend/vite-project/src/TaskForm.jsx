import { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return alert("User not authenticated!");

    try {
      const res = await axios.post('https://todo-task-manager-hackathon.onrender.com/api/tasks', {
        title,
        dueDate, // ✅ send dueDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle('');
      setDueDate('');
      if (onTaskAdded) onTaskAdded(); // ✅ Refresh tasks after add
    } catch (err) {
      console.error('❌ Error adding task:', err.response?.data || err.message);
      alert("Task creation failed");
    }
  };

  return (
    <form onSubmit={handleAddTask} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ marginRight: '10px' }}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
