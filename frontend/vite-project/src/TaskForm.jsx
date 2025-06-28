import { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', {
        title
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTitle('');
      onTaskAdded(res.data); // Notify parent
    } catch (err) {
      console.error('Error adding task:', err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleAddTask}>
      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskForm;
