import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import {
  MdOutlineLogout,
  MdOutlineWorkOutline,
  MdOutlineDashboard,
  MdOutlineClose,
  MdOutlineMenu,
} from 'react-icons/md';
import './Sidebar.scss';
import { logout } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { setToken } = useAuth();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    return <Navigate to="/" />;
  };

  const handleSetActiveLink = (link) => {
    setActiveLink(link);
    if (window.innerWidth < 1201) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              {/* Hamburger Button */}
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg custom:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">
                  {isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                </span>
                {isSidebarOpen ? (
                  <MdOutlineClose className="w-6 h-6" />
                ) : (
                  <MdOutlineMenu className="w-6 h-6" />
                )}
              </button>
              {/* Logo */}
              <Link to="/dashboard" className="flex ms-2 md:me-24">
                <span className="task-manager self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  Task Manager
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isSidebarOpen ? '' : '-translate-x-full'
        } bg-white border-r border-gray-200 custom:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800 flex flex-col justify-between">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/dashboard"
                onClick={() => handleSetActiveLink('/dashboard')}
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:hover:bg-gray-700 group ${
                  activeLink === '/dashboard'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <MdOutlineDashboard
                  size={20}
                  className={`${
                    activeLink === '/dashboard' ? 'text-white' : 'text-gray-900'
                  }`}
                />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                onClick={() => handleSetActiveLink('/tasks')}
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:hover:bg-gray-700 group ${
                  activeLink === '/tasks'
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <MdOutlineWorkOutline
                  size={20}
                  className={`${
                    activeLink === '/tasks' ? 'text-white' : 'text-gray-900'
                  }`}
                />
                <span className="ms-3">Tasks</span>
              </Link>
            </li>
            <hr className="border-t border-gray-200 dark:border-gray-700" />
          </ul>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                onClick={handleLogout}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white dark:hover:bg-gray-700 group"
              >
                <MdOutlineLogout size={20} />
                <span className="ms-3">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
