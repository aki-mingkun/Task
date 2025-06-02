import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem('tokens')) || {};
    setUsername(tokens.username || '');
  }, []);

  useEffect(() => {
    if (!username) return;
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/dashboard/${username}`);
        console.log("Dashboard username:", username);
        console.log("Dashboard data:", res.data);
        setSummary(res.data);
      } catch (err) {
        setSummary(null);
      }
    };
    fetchSummary();
  }, [username]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Created Tasks</h3>
          <p className="text-3xl font-bold">{summary.total_created}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Assigned To You</h3>
          <p className="text-3xl font-bold">{summary.total_assigned}</p>
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
