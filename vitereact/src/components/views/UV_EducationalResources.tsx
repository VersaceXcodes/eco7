import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';
import { z } from 'zod';

// Define the EducationalResource type using Zod schema
const educationalResourceSchema = z.object({
  resource_id: z.string(),
  title: z.string(),
  content_url: z.string().url(),
  content_type: z.string(),
  topic: z.string(),
  created_at: z.coerce.date(),
});
type EducationalResource = z.infer<typeof educationalResourceSchema>;

const UV_EducationalResources: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTopic, setFilterTopic] = useState<string>('');
  const globalDefaultLimit = 10;
  const globalDefaultOffset = 0;

  const fetchResources = useCallback(async (): Promise<EducationalResource[]> => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/educational-resources`, {
      params: { topic: filterTopic, limit: globalDefaultLimit, offset: globalDefaultOffset },
    });
    return response.data;
  }, [filterTopic, globalDefaultLimit, globalDefaultOffset]);

  const { data: resources, isLoading, error } = useQuery(['resources', filterTopic, globalDefaultLimit, globalDefaultOffset], fetchResources, {
    keepPreviousData: true,
  });

  useEffect(() => {
    // Refetch resources whenever the search query or filter topic changes
  }, [searchQuery, filterTopic]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Educational Resources</h1>
          <div className="mt-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for resources..."
              className="px-4 py-2 border rounded-lg w-full"
            />
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="mt-4 px-4 py-2 border rounded-lg"
            >
              <option value="">All Topics</option>
              <option value="Climate">Climate</option>
              <option value="Biodiversity">Biodiversity</option>
              {/* Add more options as needed */}
            </select>
          </div>
          {isLoading ? (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-6">
              <p className="text-sm">Error loading resources. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {resources?.map((resource) => (
                <div key={resource.resource_id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h2 className="font-semibold text-xl text-gray-900">{resource.title}</h2>
                    <p className="text-gray-600 mt-2">{resource.topic}</p>
                    <Link to={resource.content_url} target="_blank" className="text-blue-500 hover:underline mt-4 block">
                      Access Resource
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UV_EducationalResources;