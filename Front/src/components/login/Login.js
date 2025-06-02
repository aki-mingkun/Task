import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { setToken } from '../../services/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from '../login/LoginForm';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken: setAuthContextToken } = useAuth();

  const handleChange = (e) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);

    try {
      const data = await login(formData);
      // Lưu username vào localStorage để dùng cho các request sau này
      setToken({ username: formData.username });
      setAuthContextToken(formData.username);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError(err.response?.data?.error || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login
            </h1>
            <LoginForm
              formData={formData}
              error={error}
              loading={loading}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
