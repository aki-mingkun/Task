import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTask } from '../services/api';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTask = location.state?.currentTask || null;

  const [title, setTitle] = useState(currentTask ? currentTask.title : '');
  const [description, setDescription] = useState(
    currentTask ? currentTask.description : ''
  );
  const [dueDate, setDueDate] = useState(
    currentTask ? currentTask.due_date : ''
  );
  const [status, setStatus] = useState(
    currentTask ? currentTask.status : 'open'
  );
  const [priority, setPriority] = useState(
    currentTask ? currentTask.priority : 'low'
  );
  const [assignedUser, setAssignedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [formOpen, setFormOpen] = useState(true);

  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy username từ localStorage (ưu tiên key 'username')
    const usernameStored = localStorage.getItem('username');
    setUsername(usernameStored || '');
    // Nếu chưa có assignedUser, gán luôn là username
    setAssignedUser((prev) => prev || usernameStored || '');
    setLoading(false);
  }, []);

  useEffect(() => {
    // Lấy danh sách user từ backend
    const fetchUsers = async () => {
      try {
        // Đổi 'http://backend:5000/users' thành IP backend thực tế
        const res = await axios.get('http://10.6.136.246:5000/users');
        setUsers(res.data.map((u) => u.username));
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    if (!title.trim()) {
      setTitleError('Title is required.');
      isValid = false;
    } else {
      setTitleError('');
    }
    if (!description.trim()) {
      setDescriptionError('Description is required.');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    if (!dueDate) {
      setDueDateError('Due Date is required.');
      isValid = false;
    } else {
      setDueDateError('');
    }
    if (!username) {
      toast.error('You must be logged in to create a task.');
      return;
    }
    if (!isValid) return;

    const taskData = {
      username,
      task: {
        title,
        description,
        due_date: dueDate,
        status,
        priority,
        // Đảm bảo assigned_user luôn là username nếu không chọn ai
        assigned_user: assignedUser || username,
      },
    };

    try {
      await createTask(taskData);
      toast.success('Task created successfully');
      navigate('/tasks');
    } catch (err) {
      toast.error('Failed to save task');
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    navigate('/tasks');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!username) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-warning">
          You must be logged in to create a task.
        </div>
      </div>
    );
  }

  if (!formOpen) return null;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-12">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
        onClick={handleClose}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M14.293 5.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 111.414-1.414L10 8.586l4.293-4.293z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white dark:bg-gray-900 rounded-lg"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentTask ? 'Edit Task' : 'Create Task'}
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                titleError ? 'border-red-500' : ''
              }`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError && <p className="text-sm text-red-500">{titleError}</p>}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description:
            </label>
            <textarea
              id="description"
              className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                descriptionError ? 'border-red-500' : ''
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {descriptionError && (
              <p className="text-sm text-red-500">{descriptionError}</p>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="due-date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Due Date:
            </label>
            <input
              type="date"
              id="due-date"
              className={`shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                dueDateError ? 'border-red-500' : ''
              }`}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            {dueDateError && (
              <p className="text-sm text-red-500">{dueDateError}</p>
            )}
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Status:
            </label>
            <select
              id="status"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="priority"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Priority:
            </label>
            <select
              id="priority"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="assigned-user"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Assign to:
            </label>
            <select
              id="assigned-user"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
            >
              {/* Nếu chưa chọn ai, mặc định là username hiện tại */}
              <option value={username}>{username}</option>
              {users
                .filter((user) => user !== username)
                .map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currentTask ? 'Update Task' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;