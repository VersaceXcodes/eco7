import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { carbonFootprintEntrySchema } from "@/DB:zodschemas:ts";
import { z } from 'zod'; 

interface FormData {
  travel: number | null;
  diet: number | null;
  energy_use: number | null;
}

const UV_CarbonFootprintCalculator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ travel: null, diet: null, energy_use: null });
  const [error, setError] = useState<string | null>(null);
  
  const authToken = useAppStore(state => state.authentication_state.auth_token);
  const currentUser = useAppStore(state => state.authentication_state.current_user);

  const mutation = useMutation(
    (data: FormData) => {
      return axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/carbon-footprint-entries`,
        { ...data, user_id: currentUser?.id },
        { headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' } }
      );
    },
    {
      onSuccess: (response) => {
        console.log('Footprint entry created', response.data);
        // Set form state back to defaults after successful submission
        setFormData({ travel: null, diet: null, energy_use: null });
        setError(null);
      },
      onError: (error) => {
        console.error('Error creating entry', error);
        setError('Failed to submit the data. Please try again.');
      },
    }
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setError(null);
    setFormData(prev => ({ ...prev, [field]: value === '' ? null : Number(value) }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(formData);
  };

  const validateInputs = (): boolean => {
    try {
      carbonFootprintEntrySchema.parse({
        user_id: currentUser?.id || '',
        ...formData,
        entry_id: '',
        created_at: new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error('Validation error', e);
      setError('Invalid input data');
      return false;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Carbon Footprint Calculator</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="text-sm" aria-live="polite">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="travel" className="block text-sm font-medium text-gray-700">Travel (in km)</label>
              <input
                type="number"
                id="travel"
                name="travel"
                value={formData.travel || ''}
                onChange={(e) => handleInputChange('travel', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="diet" className="block text-sm font-medium text-gray-700">Diet Impact (score)</label>
              <input
                type="number"
                id="diet"
                name="diet"
                value={formData.diet || ''}
                onChange={(e) => handleInputChange('diet', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="energy_use" className="block text-sm font-medium text-gray-700">Energy Use (kWh)</label>
              <input
                type="number"
                id="energy_use"
                name="energy_use"
                value={formData.energy_use || ''}
                onChange={(e) => handleInputChange('energy_use', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <button
                type="submit"
                onClick={validateInputs}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? 'Submitting...' : 'Submit Footprint'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UV_CarbonFootprintCalculator;