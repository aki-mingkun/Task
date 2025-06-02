import { useEffect, useState } from 'react';
import { getTasks, deleteTask, updateTask } from '../../services/api';
import { toast } from 'react-toastify';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TaskFilters from './TaskFilters';
import TaskTable from './TaskTable';
import '../../index.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'open',
    priority: 'low',
    assigned_user: ''
  });

  useEffect(() => {
    // Lấy username đúng key từ localStorage (ưu tiên key 'username')
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      setLoading(false);
      return;
    }
    setUsername(storedUsername);
    // ...nếu muốn, có thể gọi fetchTasks(storedUsername) ở đây...
  }, []);

  useEffect(() => {
    console.log('Current username:', username);
    if (!username) {
      setLoading(false);
      return;
    }
    const fetchTasks = async () => {
      try {
        const data = await getTasks(username);
        console.log('Tasks fetched:', data);
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [username]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      status: task.status,
      priority: task.priority,
      assigned_user: task.assigned_user
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(editingTask.id, editForm);
      // Sau khi update, lấy lại tasks từ server cho user hiện tại
      const data = await getTasks(username);
      setTasks(Array.isArray(data) ? data : []);
      setEditingTask(null);
      toast.success('Task updated');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }

  if (!username) {
    return <div className="alert alert-warning">You must be logged in to view tasks.</div>;
  }

  // Lọc task: chỉ lấy task mà user là người tạo hoặc được giao
  const filteredTasks = tasks.filter(
    (task) =>
      (task.created_by === username || task.assigned_user === username) &&
      (task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === 'all' || task.status === statusFilter)
  );

  filteredTasks.sort((a, b) => (b.id || '').localeCompare(a.id || ''));

  return (
    <div className="container">
      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <TaskTable
        tasks={filteredTasks}
        handleDelete={handleDelete}
        handleEdit={handleEditClick}
      />
      {filteredTasks.length === 0 && (
        <div className="alert alert-warning">
          No tasks match your search criteria.
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md"
            onSubmit={handleEditSubmit}
          >
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <div className="mb-2">
              <label className="block mb-1">Title</label>
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={editForm.due_date}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Priority</label>
              <select
                name="priority"
                value={editForm.priority}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Assigned User</label>
              <input
                name="assigned_user"
                value={editForm.assigned_user}
                onChange={handleEditChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskList;
