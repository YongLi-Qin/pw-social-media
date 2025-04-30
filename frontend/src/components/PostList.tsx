import { useState } from 'react';
import PostItem from './PostItem';

interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
}

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user: User;
  gameRanking?: {
    id: number;
    rankingName: string;
  };
}

interface PostListProps {
  posts: Post[];
  onPostUpdated: () => void;
}

export default function PostList({ posts = [], onPostUpdated }: PostListProps) {
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const toggleExpand = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  if (!Array.isArray(posts)) {
    return (
      <div className="text-center py-4 text-gray-600">
        No posts available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          isExpanded={expandedPost === post.id}
          onToggleExpand={() => toggleExpand(post.id)}
          onPostUpdated={onPostUpdated}
        />
      ))}
    </div>
  );
} 