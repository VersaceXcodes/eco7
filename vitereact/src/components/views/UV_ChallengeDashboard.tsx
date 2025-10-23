import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { sustainabilityChallengeSchema, SustainabilityChallenge } from '@/db/zodschemas';

const UV_ChallengeDashboard: React.FC = () => {
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);

  // Fetch challenges
  const { data: challenges, isLoading: isChallengesLoading, error: challengesError } = useQuery('challenges', async () => {
    const response = await axios.get<SustainabilityChallenge[]>(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/sustainability-challenges`
    );
    return sustainabilityChallengeSchema.array().parse(response.data);
  });

  useEffect(() => {
    if (!isAuthenticated) {
      // Handle lack of authentication, such as redirecting, if needed
    }
  }, [isAuthenticated]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-center text-4xl font-bold text-gray-900">Sustainability Challenges</h1>
          
          {isChallengesLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : challengesError ? (
            <div className="text-center text-red-500">Failed to load challenges.</div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
              {challenges?.map(challenge => (
                <div key={challenge.challenge_id} className="bg-white shadow-lg rounded-xl p-6">
                  <h2 className="text-2xl font-semibold text-gray-800">{challenge.title}</h2>
                  <p className="mt-2 text-gray-600">{challenge.description}</p>
                  <p className="mt-4 text-sm text-gray-500">Duration: {challenge.duration}</p>
                  <div className="mt-6">
                    <Link to={`/challenges/${challenge.challenge_id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Placeholder for leaderboard and rewards showcasing */}
          <div className="grid gap-6">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800">Leaderboard (Coming Soon)</h3>
              <p className="mt-2 text-gray-600">Rankings will be displayed here once available.</p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800">Rewards (Coming Soon)</h3>
              <p className="mt-2 text-gray-600">Earn badges and rewards for participating in challenges.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_ChallengeDashboard;