import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaTrash, FaEdit, FaSearch, FaUserShield, FaSave, FaTimes, FaComments } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import PostItem from '../components/PostItem';

interface Post {
  id: number;
  content: string;
  createdAt: string;
  gameType: string;
  imageUrl?: string;
  user: {
    id: number;
    name: string;
    email: string;
    picture?: string;
  };
  commentCount: number;
  gameRanking?: {
    id: number;
    gameType: string;
    rankingName: string;
    rankingScore: number;
  };
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  post: {
    id: number;
    content: string;
  };
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // 编辑状态
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    
    // 检查用户是否为管理员
    if (!user.isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');  // 重定向到主页
      return;
    }
    
    if (activeTab === 'posts') {
      fetchPosts();
    } else if (activeTab === 'comments') {
      fetchComments();
    }
  }, [activeTab, navigate]);

  // 如果不是管理员，显示加载状态或直接返回 null
  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Checking permissions...</p>
        </div>
      </div>
    );
  }

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/admin/comments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Comment deleted successfully');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditCommentContent(comment.content);
  };

  const saveCommentEdit = async (commentId: number) => {
    if (!editCommentContent.trim()) {
      toast.error('Comment content cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/comments/${commentId}`, {
        content: editCommentContent
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Comment updated successfully');
      setEditingComment(null);
      setEditCommentContent('');
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditCommentContent('');
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComments = comments.filter(comment => 
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 处理帖子更新后的回调
  const handlePostUpdated = () => {
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaUserShield className="text-red-500 text-2xl mr-3" />
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="text-sm text-gray-400">
              Welcome, {currentUser?.name} (Administrator)
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-zinc-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              <FaFileAlt className="inline mr-2" />
              Post Management
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              <FaComments className="inline mr-2" />
              Comment Management
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Posts Content */}
        {activeTab === 'posts' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-medium text-white">Posts ({filteredPosts.length})</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-400">Loading posts...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="relative">
                    {/* Admin Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        Admin View
                      </span>
                    </div>
                    <PostItem 
                      post={post} 
                      onPostUpdated={handlePostUpdated}
                    />
                  </div>
                ))}
                {filteredPosts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No posts found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Comments Content */}
        {activeTab === 'comments' && (
          <div className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-700">
              <h2 className="text-lg font-medium text-white">Comments ({filteredComments.length})</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-400">Loading comments...</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-700">
                {filteredComments.map((comment) => (
                  <div key={comment.id} className="p-6 hover:bg-zinc-700 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-white">{comment.user.name}</span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        {editingComment === comment.id ? (
                          <div className="mb-4">
                            <textarea
                              value={editCommentContent}
                              onChange={(e) => setEditCommentContent(e.target.value)}
                              className="w-full p-3 bg-zinc-600 border border-zinc-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                              rows={3}
                            />
                            <div className="flex space-x-2 mt-2">
                              <button
                                onClick={() => saveCommentEdit(comment.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                              >
                                <FaSave className="mr-1" /> Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
                              >
                                <FaTimes className="mr-1" /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-300 mb-2">{comment.content}</p>
                        )}
                        
                        <div className="text-sm text-gray-400">
                          On post: "{comment.post.content.substring(0, 50)}..." • Comment ID: {comment.id}
                        </div>
                      </div>
                      
                      {editingComment !== comment.id && (
                        <div className="ml-4 flex space-x-2">
                          <button
                            onClick={() => startEditComment(comment)}
                            className="text-blue-400 hover:text-blue-300 flex items-center transition-colors duration-200"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="text-red-400 hover:text-red-300 flex items-center transition-colors duration-200"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredComments.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No comments found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 