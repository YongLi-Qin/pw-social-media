import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { SiLeagueoflegends, SiValorant, SiRiotgames } from 'react-icons/si';
import { updatePost, deletePost } from '../services/api';
import { toast } from 'react-toastify';

interface PostItemProps {
  post: {
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
  };
  onPostUpdated: () => void;
}

export default function PostItem({ post, onPostUpdated }: PostItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isCurrentUserPost = currentUser.email === post.user.email;
  
  // Format date
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  
  // Get game icon based on game type
  const getGameIcon = () => {
    switch(post.gameType) {
      case 'LEAGUE_OF_LEGENDS':
        return <SiLeagueoflegends className="text-yellow-500" />;
      case 'VALORANT':
        return <SiValorant className="text-red-500" />;
      default:
        return <SiRiotgames className="text-gray-500" />;
    }
  };
  
  const handleSave = async () => {
    if (!editContent.trim()) return;
    
    try {
      await updatePost(post.id, editContent);
      setIsEditing(false);
      toast.success('Post updated successfully');
      onPostUpdated();
    } catch (error) {
      console.error('Failed to update post:', error);
      toast.error('Failed to update post');
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      toast.success('Post deleted successfully');
      onPostUpdated();
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      {/* Post header with user info */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {post.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <div className="font-medium">{post.user.name}</div>
            <div className="text-xs text-gray-500">{formattedDate}</div>
          </div>
        </div>
        
        {/* Game type and ranking badge */}
        <div className="flex items-center space-x-2">
          {post.gameType !== 'GENERAL' && (
            <div className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs">
              {getGameIcon()}
              <span className="ml-1">{post.gameType.replace('_', ' ')}</span>
            </div>
          )}
          
          {/* Display ranking if available */}
          {post.gameRanking && (
            <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {post.gameRanking.rankingName}
            </div>
          )}
        </div>
      </div>
      
      {/* Post content */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </div>
      ) : (
        <div className="mb-3 whitespace-pre-wrap">{post.content}</div>
      )}
      
      {/* Post image if available */}
      {post.imageUrl && (
        <div className="mb-3">
          <img src={post.imageUrl} alt="Post" className="rounded-lg max-h-96 w-auto" />
        </div>
      )}
      
      {/* Action buttons for post owner */}
      {isCurrentUserPost && (
        <div className="flex justify-end space-x-2 mt-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                disabled={!editContent.trim()}
              >
                <FaSave />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                }}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <FaEdit />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                disabled={isDeleting}
              >
                <FaTrash />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
} 