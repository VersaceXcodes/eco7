import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';

interface SubscriptionResponse {
  is_subscribed: boolean;
}

const GV_Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  const currentUser = useAppStore(state => state.authentication_state.current_user);

  const mutation = useMutation<SubscriptionResponse, Error, string>({
    mutationFn: (email) => 
      axios.post<SubscriptionResponse>(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/subscriptions/newsletter`,
        { email }
      ).then(response => response.data),
    onSuccess: (data) => {
      if (data.is_subscribed) {
        alert('Successfully subscribed to the newsletter!');
      }
    },
    onError: (error) => {
      setSubscribeError(error.message);
    }
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeError(null);

    const user_email = isAuthenticated && currentUser ? currentUser.email : email;
    mutation.mutate(user_email);
  };

  return (
    <>
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
          <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
            <Link to="/" className="hover:text-blue-400 transition-colors">Eco7</Link>
            <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            <Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ</Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
          </div>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" className="hover:text-blue-400 transition-colors" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" className="hover:text-blue-400 transition-colors" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" className="hover:text-blue-400 transition-colors" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
          {!isAuthenticated && (
            <form onSubmit={handleSubscribe} className="flex flex-col items-center">
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
              {subscribeError && <p className="text-red-500 mt-2">{subscribeError}</p>}
            </form>
          )}
        </div>
      </footer>
    </>
  );
};

export default GV_Footer;