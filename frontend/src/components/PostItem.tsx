import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash, FaEdit, FaSave, FaTimes, FaComment, FaThumbsUp, FaShare, FaEllipsisH, FaPencilAlt } from 'react-icons/fa';
import { SiLeagueoflegends, SiValorant, SiRiotgames } from 'react-icons/si';
import { FaGamepad } from 'react-icons/fa';
import { updatePost, deletePost } from '../services/api';
import { toast } from 'react-toastify';
import CommentList from './CommentList';
import { GameType } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  picture?: string;  // 改用 picture 而不是 avatar
}

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
  user: User;
  commentCount: number;
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
  const rankName_lower = rankName.toLowerCase();
  if (rankName_lower.includes('iron')) return 'bg-gray-500';
  if (rankName_lower.includes('bronze')) return 'bg-amber-700';
  if (rankName_lower.includes('silver')) return 'bg-gray-400';
  if (rankName_lower.includes('gold')) return 'bg-yellow-500';
  if (rankName_lower.includes('platinum')) return 'bg-cyan-400';
  if (rankName_lower.includes('diamond')) return 'bg-blue-500';
  if (rankName_lower.includes('master')) return 'bg-purple-600';
  if (rankName_lower.includes('grandmaster')) return 'bg-red-600';
  if (rankName_lower.includes('challenger')) return 'bg-gradient-to-r from-cyan-500 to-blue-500';
  return 'bg-gray-400'; // 默认颜色
};

export default function PostItem({ post, onPostUpdated }: { post: Post, onPostUpdated: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  console.log(`[DEBUG] Current user:`, currentUser);
  
  // Modify comparison logic
  const isCurrentUserPost = 
    (currentUser.email && post.user?.email && currentUser.email === post.user.email) || 
    (currentUser.id && post.user?.id && currentUser.id === post.user.id);
  
  console.log(`[DEBUG] Is current user post:`, isCurrentUserPost, {
    currentUserEmail: currentUser.email,
    postUserEmail: post.user?.email,
    currentUserId: currentUser.id,
    postUserId: post.user?.id
  });
  
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
    if (window.confirm('Are you sure you want to delete this post?')) {
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
    }
  };
  
  useEffect(() => {
    console.log(`[DEBUG] PostItem received post:`, post);
    console.log(`[DEBUG] Post user:`, post.user);
    console.log('Post user data:', post.user);
    console.log('User avatar:', post.user?.picture);
  }, [post]);
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      {/* Post header with user info and game badges */}
      <div className="flex flex-col mb-3">
        {/* User info row */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              {post.user?.picture ? (
                <img 
                  src={post.user.picture} 
                  alt={`${post.user.name}'s avatar`} 
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    console.log('Picture load error:', e);
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.className = 'text-gray-600 font-bold';
                      span.textContent = post.user.name.charAt(0).toUpperCase();
                      parent.appendChild(span);
                    }
                  }}
                />
              ) : (
                <span className="text-gray-600 font-bold">
                  {post.user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="font-medium">{post.user?.name || 'Unknown user'}</div>
              <div className="text-xs text-gray-500">
                {post.user?.email ? post.user.email : 'No email available'}
              </div>
              <div className="text-xs text-gray-500">{formattedDate}</div>
            </div>
          </div>
          
          {/* Edit/Delete buttons for own posts */}
          {isCurrentUserPost && (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FaEllipsisH />
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <FaPencilAlt className="mr-2" /> Edit Post
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  >
                    <FaTrash className="mr-2" /> Delete Post
                  </button>
                </div>
              )}
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
                          const rankColor = post.gameRanking ? getRankColor(post.gameRanking.rankingName) : 'bg-gray-400';
                          const circle = document.createElement('div');
                          circle.className = `w-6 h-6 rounded-full mr-3 ${rankColor}`;
                          parent.insertBefore(circle, target.nextSibling);
                        }
                      }}
                    />
                  ) : (
                    // For other game types, use colored circle
                    <div className={`w-6 h-6 rounded-full ${post.gameRanking ? getRankColor(post.gameRanking.rankingName) : 'bg-gray-400'}`}></div>
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