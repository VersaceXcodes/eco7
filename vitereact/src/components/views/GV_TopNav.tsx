import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';

const GV_TopNav: React.FC = () => {
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const logoutUser = useAppStore(state => state.logout_user);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full z-10 top-0 py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Eco7
            </Link>
            <div className="ml-6 space-x-4">
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
                Profile
              </Link>
              <Link to="/carbon-footprint-calculator" className="text-gray-700 hover:text-blue-600 transition">
                Calculator
              </Link>
              <Link to="/community-forum" className="text-gray-700 hover:text-blue-600 transition">
                Forum
              </Link>
              <Link to="/educational-resources" className="text-gray-700 hover:text-blue-600 transition">
                Resources
              </Link>
              <Link to="/eco-shop" className="text-gray-700 hover:text-blue-600 transition">
                Shop
              </Link>
              <Link to="/challenges" className="text-gray-700 hover:text-blue-600 transition">
                Challenges
              </Link>
              <Link to="/partnerships" className="text-gray-700 hover:text-blue-600 transition">
                Partnerships
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 mr-4">{currentUser?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Log In
                </Link>
                <Link to="/register" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default GV_TopNav;