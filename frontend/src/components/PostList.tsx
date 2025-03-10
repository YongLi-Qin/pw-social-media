import { useState, useEffect } from 'react';
import PostItem from './PostItem';
import { toast } from 'react-toastify';

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  gameType: string;
  gameRanking?: {
    id: number;
    gameType: string;
    rankingName: string;
    rankingScore: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface PostListProps {
  initialPosts: Post[];
  isLoading: boolean;
  onPostUpdated?: () => void;
}

export default function PostList({ initialPosts, isLoading, onPostUpdated }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const handlePostUpdated = () => {
    onPostUpdated?.();
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading posts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {sortedPosts.map((post) => (
        <PostItem 
          key={post.id} 
          post={post} 
          onPostUpdated={handlePostUpdated} 
        />
      ))}

      {posts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No posts yet.
        </div>
      )}
    </div>
  );
} 