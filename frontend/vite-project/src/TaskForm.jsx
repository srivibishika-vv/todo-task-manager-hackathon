import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const API_URL = 'https://todo-task-manager-hackathon.onrender.com/api/tasks';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!title.trim()) {
      toast.warning('Task title is required');
      return;
    }

    try {
      await axios.post(
        API_URL,
        {
          title,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle('');
      setDueDate('');
      toast.success('Task added successfully');
      onTaskAdded(); // ✅ Refresh the task list
    } catch (err) {
      console.error('❌ Error adding task:', err.message);
      toast.error('Failed to add task');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button type="submit">➕ Add Task</button>
    </form>
  );
};

export default TaskForm;
