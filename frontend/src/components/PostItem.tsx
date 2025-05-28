import  { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash, FaSave, FaTimes, FaComment, FaPencilAlt } from 'react-icons/fa';
import { SiLeagueoflegends, SiValorant, SiRiotgames } from 'react-icons/si';
import { updatePost, deletePost } from '../services/api';
import { toast } from 'react-toastify';
import CommentList from './CommentList';

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

// 检查是否为管理员页面和管理员用户
const isAdminPage = () => {
  return window.location.pathname === '/admin';
};

const isAdminUser = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.isAdmin === true;
};

export default function PostItem({ post, onPostUpdated }: { post: Post, onPostUpdated: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showComments, setShowComments] = useState(false);  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  console.log(`[DEBUG] Current user:`, currentUser);
  
  // 修改权限检查逻辑
  const isCurrentUserPost = 
    (currentUser.email && post.user?.email && currentUser.email === post.user.email) || 
    (currentUser.id && post.user?.id && currentUser.id === post.user.id);
  
  // 管理员权限：在管理员页面时，只有真正的管理员可以编辑/删除所有帖子
  const canEditOrDelete = isCurrentUserPost || (isAdminPage() && isAdminUser());
  
  console.log(`[DEBUG] Is current user post:`, isCurrentUserPost, {
    currentUserEmail: currentUser.email,
    postUserEmail: post.user?.email,
    currentUserId: currentUser.id,
    postUserId: post.user?.id,
    isAdminPage: isAdminPage(),
    isAdminUser: isAdminUser(),
    canEditOrDelete: canEditOrDelete
  });

  const handleSave = async () => {
    try {
      await updatePost(post.id, { content: editContent });
      toast.success('Post updated successfully');
      setIsEditing(false);
      onPostUpdated();
    } catch (error) {
      console.error('Failed to update post:', error);
      toast.error('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id);
        toast.success('Post deleted successfully');
        onPostUpdated();
      } catch (error) {
        console.error('Failed to delete post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  const getGameIcon = (gameType: string) => {
    switch (gameType) {
      case 'LEAGUE_OF_LEGENDS':
        return <SiLeagueoflegends className="text-blue-500" />;
      case 'VALORANT':
        return <SiValorant className="text-red-500" />;
      default:
        return <SiRiotgames className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-6 shadow-lg border border-zinc-700">
      {/* Post header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {/* User avatar */}
          <div className="w-12 h-12 rounded-full bg-zinc-600 flex items-center justify-center mr-3 overflow-hidden">
            {post.user?.picture ? (
              <img 
                src={post.user.picture} 
                alt={post.user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg">
                {post.user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          
          {/* User info and game type */}
          <div>
            <div className="flex items-center">
              <h3 className="font-semibold text-white mr-2">{post.user?.name || 'Unknown User'}</h3>
              <div className="flex items-center text-sm text-gray-400">
                {getGameIcon(post.gameType)}
                <span className="ml-1">{post.gameType.replace('_', ' ')}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        {/* Right side container with ranking and buttons */}
        <div className="flex items-center space-x-4">
          {/* Game ranking display */}
          {post.gameRanking && (
            <div>
              {post.gameRanking.rankingName && (
                <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full border border-gray-600">
                  <div className="flex items-center mr-2">
                    {(post.gameType === 'LEAGUE_OF_LEGENDS' || post.gameType === 'VALORANT') ? (
                      <img 
                        src={getRankingImagePath(post.gameType, post.gameRanking.rankingName)}
                        alt={post.gameRanking.rankingName}
                        className="w-6 h-6 mr-3"
                        onError={(e) => {
                          console.error(`[ERROR] Failed to load ranking image: ${e.currentTarget.src}`);
                          
                          // Debug: Try to fetch the image to see the actual error
                          const target = e.currentTarget as HTMLImageElement;
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
                  <span className="font-semibold text-white">{post.gameRanking.rankingName}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Edit/Delete buttons - 显示给帖子作者或管理员 */}
          {canEditOrDelete && (
            <div className="flex space-x-2">
              {isAdminPage() && (
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                  Admin
                </span>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <FaPencilAlt className="mr-1" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Post content */}
      <div className="mb-3">
        {isEditing ? (
          <div className="mb-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-400"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
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
          <div className="text-white whitespace-pre-wrap">{post.content}</div>
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