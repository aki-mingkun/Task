import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignupForm from '../signup/SignupForm';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError('');
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email) {
      setError('Username, email, and password are required.');
      return;
    }
    setLoading(true);
    try {
      // Gửi cả email
      const data = await signup({
        username: formData.username,
        password: formData.password,
        email: formData.email,
      });
      console.log('Signup successful', data);
      toast.success('Signup successful! Please login to continue.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
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
              Create an account
            </h1>
            <SignupForm
              formData={formData}
              error={error}
              loading={loading}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
            {/* Link to login page */}
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
