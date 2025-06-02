import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Lấy username từ localStorage (ưu tiên key 'username')
    const usernameStored = localStorage.getItem('username');
    setUsername(usernameStored || '');
  }, []);

  useEffect(() => {
    if (!username) return;
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/dashboard/${username}`);
        setSummary(res.data);
      } catch (err) {
        setSummary(null);
      }
    };
    fetchSummary();
  }, [username]);

  if (!username) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-warning">
          You must be logged in to view dashboard.
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 mt-4">Task Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Created Tasks</h3>
          <p className="text-3xl font-bold">{summary.total_created}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Assigned To You</h3>
          <p className="text-3xl font-bold">{summary.total_assigned}</p>
          {summary.tasks_assigned && summary.tasks_assigned.length > 0 ? (
            <ul className="mt-2 list-disc ml-5">
              {summary.tasks_assigned.map((task) => (
                <li key={task.id}>
                  <span className="font-semibold">{task.title}</span>
                  {task.due_date ? (
                    <span className="ml-2 text-sm text-gray-500">
                      (Due: {task.due_date})
                    </span>
                  ) : null}
                  <span className="ml-2 text-xs text-gray-400">
                    [From: {task.created_by}]
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm mt-2">No assigned tasks.</p>
          )}
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">All Involved Tasks</h3>
          <p className="text-3xl font-bold">{summary.total_involved}</p>
          {summary.tasks_involved && summary.tasks_involved.length > 0 ? (
            <ul className="mt-2 list-disc ml-5">
              {summary.tasks_involved.map((task) => (
                <li key={task.id}>
                  <span className="font-semibold">{task.title}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    [By: {task.created_by}, To: {task.assigned_user}]
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm mt-2">No tasks.</p>
          )}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 mt-4">
        <h3 className="text-xl font-semibold mb-2">Created Task Status</h3>
        <ul>
          <li>Completed: {summary.completed_created}</li>
          <li>In Progress: {summary.in_progress_created}</li>
          <li>Open: {summary.overdue_created}</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
