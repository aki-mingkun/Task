import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/login/Login';
import Signup from './components/signup/signup';
import Dashboard from './components/Dashboard';
import TaskList from './components/taskutils/TaskList';
import TaskForm from './components/TaskForm';
import BaseLayout from './layout/BaseLayout';
import SplashScreen from './splash/SplashScreen';
import NotFound from './components/NotFound';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { token } = useAuth();
  return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<BaseLayout />}>
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={Dashboard} />}
            />
            <Route
              path="/tasks"
              element={<ProtectedRoute element={TaskList} />}
            />
            <Route
              path="/tasks/create"
              element={<ProtectedRoute element={TaskForm} />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
