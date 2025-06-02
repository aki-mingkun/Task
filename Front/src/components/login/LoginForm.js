import { ClipLoader } from 'react-spinners';

const LoginForm = ({
  formData,
  error,
  loading,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div>
        <label
          htmlFor="username"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {error && !formData.username && (
          <p className="text-sm text-red-500">Username cannot be empty.</p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && !formData.password && (
          <p className="text-sm text-red-500">Password cannot be empty.</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
        disabled={loading}
      >
        {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Login'}
      </button>
      {error && formData.username && formData.password && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </form>
  );
};

export default LoginForm;
