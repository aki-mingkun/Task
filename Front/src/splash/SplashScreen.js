import { Link } from 'react-router-dom';
import './SplashScreen.scss';

const SplashScreen = () => {
  return (
    <section className="splash">
      <div className="splash_inner">
        <h1 className="text-focus-in">Task Manager</h1>
        <p className="text text-focus-in">
          Welcome to TaskManager! 🌟
        </p>
        <div className="slide-in-bottom mt-6">
          <Link
            to="/login"
            className="border-2 border-white text-white hover:bg-blue-300 hover:text-black font-bold py-3 px-6 rounded mr-4 text-lg"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="border-2 border-white text-white hover:bg-red-300 hover:text-black font-bold py-3 px-6 rounded text-lg"
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SplashScreen;
