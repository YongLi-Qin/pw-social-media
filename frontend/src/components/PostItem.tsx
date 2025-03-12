import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash, FaEdit, FaSave, FaTimes, FaComment } from 'react-icons/fa';
import { SiLeagueoflegends, SiValorant, SiRiotgames } from 'react-icons/si';
import { updatePost, deletePost } from '../services/api';
import { toast } from 'react-toastify';
import CommentList from './CommentList';

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
    commentCount: number;
  };
  onPostUpdated: () => void;
}

// Helper function to get ranking image path
const getRankingImagePath = (gameType: string, rankingName: string): string => {
  let imagePath = '';
  
  if (gameType === 'LEAGUE_OF_LEGENDS') {
    // For League of Legends, use the original path and naming
    const baseRank = rankingName.toLowerCase();
    imagePath = `/images/lol-ranking/lol-${baseRank}.png`;
  } else if (gameType === 'VALORANT') {
    // For Valorant, use the new path and naming convention
    if (rankingName === 'Radiant') {
      imagePath = `/images/Valorant-ranking/Radiant_Rank.png`;
    } else {
      // Extract rank name and number (e.g., "Iron 1" -> "Iron_1_rank")
      const [rankBase, rankNumber] = rankingName.split(' ');
      imagePath = `/images/Valorant-ranking/${rankBase}_${rankNumber}_Rank.png`;
    }
  }
  
  // Debug logging
  console.log(`[DEBUG] Game Type: ${gameType}, Rank: ${rankingName}, Path: ${imagePath}`);
  
  return imagePath;
};

// Helper function to get rank color for fallback
const getRankColor = (rankName: string): string => {
  switch(rankName.toLowerCase()) {
    case 'iron': return 'bg-gray-500';
    case 'bronze': return 'bg-amber-700';
    case 'silver': return 'bg-gray-300';
    case 'gold': return 'bg-yellow-500';
    case 'platinum': return 'bg-cyan-400';
    case 'diamond': return 'bg-blue-400';
    case 'master': return 'bg-purple-500';
    case 'grandmaster': return 'bg-red-500';
    case 'challenger': return 'bg-gradient-to-r from-blue-500 to-purple-500';
    default: return 'bg-gray-400';
  }
};

export default function PostItem({ post, onPostUpdated }: PostItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
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
      {/* Post header with user info and game badges */}
      <div className="flex flex-col mb-3">
        {/* User info row */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {post.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <div className="font-medium">{post.user.name}</div>
              <div className="text-xs text-gray-500">{formattedDate}</div>
            </div>
          </div>
          
          {/* Edit/Delete buttons for own posts */}
          {isCurrentUserPost && (
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className="text-blue-500 hover:text-blue-700"
                aria-label="Edit post"
              >
                <FaEdit />
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete post"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        
        {/* Game badges row */}
        {(post.gameType !== 'GENERAL' || post.gameRanking) && (
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {post.gameType !== 'GENERAL' && (
              <div className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm border border-gray-200 shadow-sm h-14 min-w-[140px]">
                <span className="text-2xl mr-2">{getGameIcon()}</span>
                <span className="font-semibold">{post.gameType.replace('_', ' ')}</span>
              </div>
            )}
            
            {post.gameRanking && (
              <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-100 shadow-sm h-14 min-w-[140px]">
                <div className="flex items-center justify-center w-12 h-12 mr-2">
                  {post.gameType === 'LEAGUE_OF_LEGENDS' || post.gameType === 'VALORANT' ? (
                    <img 
                      src={getRankingImagePath(post.gameType, post.gameRanking.rankingName)} 
                      alt={post.gameRanking.rankingName}
                      className={`${post.gameType === 'LEAGUE_OF_LEGENDS' ? 'w-12 h-12' : 'w-8 h-8'} object-contain`}
                      onError={(e) => {
                        // If image fails to load, log the error and use colored circle as fallback
                        const target = e.currentTarget;
                        console.error(`[ERROR] Failed to load image: ${target.src}`);
                        
                        // Check if the file exists on the server
                        fetch(target.src)
                          .then(response => {
                            console.log(`[DEBUG] Image fetch status: ${response.status} ${response.statusText}`);
                          })
                          .catch(error => {
                            console.error(`[ERROR] Image fetch error: ${error}`);
                          });
                        
                        target.style.display = 'none';
                        
                        // Add colored circle as fallback
                        const parent = target.parentElement;
                        if (parent) {
                          const rankColor = getRankColor(post.gameRanking.rankingName);
                          const circle = document.createElement('div');
                          circle.className = `w-6 h-6 rounded-full mr-3 ${rankColor}`;
                          parent.insertBefore(circle, target.nextSibling);
                        }
                      }}
                    />
                  ) : (
                    // For other game types, use colored circle
                    <div className={`w-6 h-6 rounded-full ${getRankColor(post.gameRanking.rankingName)}`}></div>
                  )}
                </div>
                <span className="font-semibold">{post.gameRanking.rankingName}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Post content */}
      <div className="mb-3">
        {isEditing ? (
          <div className="mb-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
              >
                <FaTimes className="mr-1" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
              >
                <FaSave className="mr-1" /> Save
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-800 whitespace-pre-wrap">{post.content}</div>
        )}
      </div>
      
      {/* Post image if available */}
      {post.imageUrl && (
        <div className="mb-3">
          <img src={post.imageUrl} alt="Post attachment" className="rounded-lg max-h-96 w-auto" />
        </div>
      )}
      
      {/* Post actions */}
      <div className="flex justify-between items-center text-gray-500 text-sm">
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center hover:text-blue-600"
          >
            <FaComment className="mr-1" />
            <span>{post.commentCount || 0} Comments</span>
          </button>
          {/* Like button could go here */}
          {/* Comment button could go here */}
        </div>
        
        {/* Edit/Delete buttons moved to top */}
      </div>

      {/* Post comments */}
      <CommentList postId={post.id} isExpanded={showComments} />
    </div>
  );
} 