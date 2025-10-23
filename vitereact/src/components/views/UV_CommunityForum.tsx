import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/main';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForumThreadSchema = {
  thread_id: '',
  user_id: '',
  title: '',
  content: '',
  created_at: '',
};

interface ForumThread {
  thread_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
}

const UV_CommunityForum: React.FC = () => {
  const queryClient = useQueryClient();
  const auth_token = useAppStore(state => state.authentication_state.auth_token);
  const current_user = useAppStore(state => state.authentication_state.current_user);

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');

  const { data: threads, isLoading, error } = useQuery<ForumThread[]>({
    queryKey: ['forumThreads'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/community-forum/threads`, {
        headers: { Authorization: `Bearer ${auth_token}` },
      });
      return response.data.map((thread: typeof ForumThreadSchema) => ({
        ...thread,
        created_at: new Date(thread.created_at).toLocaleString(),
      }));
    },
  });

  const createThreadMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/community-forum/threads`, {
        user_id: current_user?.id,
        title: newThreadTitle,
        content: newThreadContent,
      }, {
        headers: { Authorization: `Bearer ${auth_token}`, 'Content-Type': 'application/json' }
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('forumThreads');
      setNewThreadTitle('');
      setNewThreadContent('');
    }
  });

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    createThreadMutation.mutate();
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Community Forum</h1>

        {isLoading && <p>Loading threads...</p>}
        {error && <p className="text-red-600">Error loading threads</p>}

        <form onSubmit={handleCreateThread} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Thread</h2>
          <input
            type="text"
            placeholder="Thread Title"
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            className="w-full px-3 py-2 border mb-4 rounded"
            required
          />
          <textarea
            placeholder="Thread Content"
            value={newThreadContent}
            onChange={(e) => setNewThreadContent(e.target.value)}
            className="w-full px-3 py-2 border mb-4 rounded"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
            disabled={createThreadMutation.isLoading}
          >
            {createThreadMutation.isLoading ? 'Posting...' : 'Post Thread'}
          </button>
        </form>

        <div className="space-y-4">
          {threads?.map(thread => (
            <div key={thread.thread_id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{thread.title}</h3>
              <p className="text-gray-600 mb-2">{thread.content}</p>
              <div className="flex justify-between text-gray-500">
                <Link to={`/profile/${thread.user_id}`} className="hover:text-blue-600">by {thread.user_id}</Link>
                <span>{thread.created_at}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UV_CommunityForum;