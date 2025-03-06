import { useState, useEffect } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { FaTrash, FaPen } from 'react-icons/fa';
import { updatePost, deletePost } from '../services/api';
import { toast } from 'react-toastify';

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
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
  const [editingPost, setEditingPost] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const handleEdit = (post: Post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
  };

  const handleUpdate = async (postId: number) => {
    try {
      const updatedPost = await updatePost(postId, editContent);
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post.id === postId 
            ? { ...post, content: editContent }
            : post
        )
      );
      setEditingPost(null);
      toast.success('Post updated successfully!');
    } catch (error) {
      toast.error('Failed to update post');
      console.error('Error updating post:', error);
      onPostUpdated?.();
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost(postId);
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post');
      console.error('Error deleting post:', error);
      onPostUpdated?.();
    }
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
        <div key={post.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-gray-900">{post.user.name}</h3>
              <p className="text-sm text-gray-500">
                {format(new Date(post.createdAt), 'PPpp')}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(post)}
                className="text-gray-500 hover:text-blue-500"
                title="Edit post"
              >
                <FaPen />
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-gray-500 hover:text-red-500"
                title="Delete post"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          
          {editingPost === post.id ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(post.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          )}
          
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="mt-4 rounded-lg max-h-96 w-full object-cover"
            />
          )}
        </div>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No posts yet.
        </div>
      )}
    </div>
  );
} 