import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { z, ZodError } from 'zod'; // Only for type-checking
import { Link } from 'react-router-dom';

const UV_Partnerships: React.FC = () => {
  const queryClient = useQueryClient();
  const authToken = useAppStore(state => state.authentication_state.auth_token);
  
  const [newPartnership, setNewPartnership] = useState<{ organization_name: string; description: string; contact_email: string }>({
    organization_name: '',
    description: '',
    contact_email: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const { data: partnerships = [], isLoading, isError } = useQuery(['partnerships'], async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/partnerships`);
    return response.data.map((item: any) => ({
      partnership_id: item.partnership_id,
      organization_name: item.organization_name,
      description: item.description,
      contact_email: item.contact_email,
      created_at: item.created_at,
    }));
  }, { staleTime: 60000 });

  const submitMutation = useMutation(async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/partnerships`,
        newPartnership,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        }
      );
      await queryClient.invalidateQueries(['partnerships']);
      setNewPartnership({ organization_name: '', description: '', contact_email: '' });
      setFormError(null);
    } catch (error: any) {
      setFormError(error?.response?.data?.message || 'An error occurred during submission.');
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormError(null);
    const { name, value } = e.target;
    setNewPartnership((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const partnershipRequestSchema = z.object({
      organization_name: z.string().min(1, "Organization name is required"),
      description: z.string().min(1, "Description is required"),
      contact_email: z.string().email("Invalid email address"),
    });

    try {
      partnershipRequestSchema.parse(newPartnership);
      submitMutation.mutate();
    } catch (error) {
      if (error instanceof ZodError) {
        setFormError(error.errors[0].message);
      }
    }
  };

  return (
    <>
      {isLoading && <div>Loading partnerships...</div>}
      {isError && <div>Error loading partnerships.</div>}

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Partnerships and Collaborations</h1>

        <div className="py-6 space-y-8">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Partnerships</h2>
            <ul className="space-y-4">
              {partnerships.map(({ partnership_id, organization_name, description }) => (
                <li key={partnership_id} className="bg-gray-50 p-4 shadow rounded-md">
                  <h3 className="text-lg font-bold">{organization_name}</h3>
                  <p className="text-gray-700">{description}</p>
                </li>
              ))}
            </ul>
            {partnerships.length === 0 && <div>No partnerships to display.</div>}
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit a New Partnership</h2>
            {formError && <div className="text-red-500 mb-4">{formError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  name="organization_name"
                  id="organization_name"
                  value={newPartnership.organization_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={newPartnership.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  id="contact_email"
                  value={newPartnership.contact_email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2"
                  disabled={submitMutation.isLoading}
                >
                  {submitMutation.isLoading ? 'Submitting...' : 'Submit Partnership'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Success Stories</h2>
            {/* Placeholder for success stories */}
            <p className="text-gray-700">This section will highlight partnership success stories...</p>
          </div>
        </div>

        <div>
          <Link to="/community-forum" className="text-blue-600 hover:text-blue-800">
            Discuss potential collaborations in our community forum
          </Link>
        </div>
      </div>
    </>
  );
};

export default UV_Partnerships;