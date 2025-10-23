import React, { useState, ReactElement } from 'react';
import { useAppStore } from '@/store/main';
import { Link } from 'react-router-dom';

const UV_Registration: React.FC = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const isLoading = useAppStore(state => state.authentication_state.authentication_status.is_loading);
  const errorMessage = useAppStore(state => state.authentication_state.error_message);
  const registerUser = useAppStore(state => state.register_user);
  const clearAuthError = useAppStore(state => state.clear_auth_error);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    if (password !== passwordConfirm) {
      alert('Passwords do not match');
      return;
    }

    try {
      await registerUser(email, password, email.split('@')[0]); // Use portion of email as default name
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8 p-6 shadow-xl rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100">
          <h2 className="text-center text-3xl font-bold text-gray-900">Create an Account</h2>
          <form className="space-y-6" onSubmit={handleRegister}>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">
                <p>{errorMessage}</p>
              </div>
            )}
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full"
                  placeholder="Password"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="password-confirm"
                  name="password-confirm"
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="input-field w-full"
                  placeholder="Confirm Password"
                  aria-describedby="password-description"
                />
                <p id="password-description" className="text-sm text-gray-500">Re-enter your password to confirm.</p>
              </div>
            </div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            <div className="flex items-center justify-center">
              <Link 
                to="/" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Already have an account? Sign in
              </Link>
            </div>
            <p className="mt-2 text-sm text-center text-gray-500">
              By signing up, you agree to our <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Terms</a> and <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default UV_Registration;