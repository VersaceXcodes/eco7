import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { User, updateUserInputSchema } from '@/types';
import { ZodError } from 'zod';
import { Link } from 'react-router-dom';

const UV_Profile: React.FC = () => {
  const authToken = useAppStore(state => state.authentication_state.auth_token);
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const [formState, setFormState] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isLoading, data: userData, refetch } = useQuery(
    ['userProfile', currentUser?.id],
    async () => {
      const { data } = await axios.get<User>(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${currentUser?.id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return data;
    },
    {
      enabled: !!currentUser?.id && !!authToken,
    }
  );

  useEffect(() => {
    if (userData) {
      setFormState(userData);
    }
  }, [userData]);

  const mutation = useMutation(
    async (updatedData: User) => {
      const { data } = await axios.patch<User>(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${currentUser?.id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return data;
    },
    {
      onSuccess: () => {
        refetch();
        setErrorMessage(null);
      },
      onError: (error: any) => {
        setErrorMessage(error.response?.data?.message || 'An error occurred updating your profile.');
      },
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setFormState(prev => prev ? { ...prev, [e.target.name]: e.target.value } : prev);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState) {
      try {
        updateUserInputSchema.parse(formState);  // Validate data with zod
        mutation.mutate(formState);
      } catch (error) {
        if (error instanceof ZodError) {
          setErrorMessage('Please correct the highlighted fields.');
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      }
    }
  };

  if (isLoading || !formState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">User Profile</h1>
        {errorMessage && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formState.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formState.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {/* Additional fields ... */}
          <div className="flex items-center space-x-3">
            <Link to="/carbon-footprint-calculator" className="text-blue-600 hover:underline">
              Track My Footprint
            </Link>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UV_Profile;