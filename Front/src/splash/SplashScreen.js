import { Link } from 'react-router-dom';
import './SplashScreen.scss';

const SplashScreen = () => {
  return (
    <section className="splash">
      <div className="splash_inner">
        <h1 className="text-focus-in">TaskManager</h1>
        <p className="text text-focus-in">
          Welcome to TaskManager! Manage your tasks effortlessly and boost your
          productivity with TaskManager. Whether you’re collaborating with a
          team or tracking your personal to-dos, TaskManager makes task
          management simple and effective. 🌟
        </p>
        <div className="slide-in-bottom mt-6">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Signup
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SplashScreen;
