import { useEffect, useState } from 'react';
import { getTasks } from '../../services/api';
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

  useEffect(() => {
    // Lấy username đúng key từ localStorage (ưu tiên key 'username')
    const storedUsername = localStorage.getItem('username');
    console.log('Frontend - Loaded username from localStorage:', storedUsername);
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

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
  }

  if (!username) {
    return <div className="alert alert-warning">You must be logged in to view tasks.</div>;
  }

  const filteredTasks = tasks.filter(
    (task) =>
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

      <TaskTable tasks={filteredTasks} />
      {filteredTasks.length === 0 && (
        <div className="alert alert-warning">
          No tasks match your search criteria.
        </div>
      )}
    </div>
  );
};

export default TaskList;
