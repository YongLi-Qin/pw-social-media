import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import CreatePostButton from '../components/CreatePostButton';
import { getUserPosts } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import { FaHome, FaUserCircle, FaCalendarAlt } from 'react-icons/fa';

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadUserPosts = async () => {
    try {
      const data = await getUserPosts();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to load posts');
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-blue-600">My Profile</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <FaHome />
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 用户信息卡片 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <FaUserCircle className="w-24 h-24 text-gray-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
              <div className="flex items-center space-x-4 mt-2 text-gray-500">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>Joined March 2024</span>
                </div>
                <div>
                  <span className="font-semibold">{posts.length}</span> posts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Posts</h2>
          </div>
          <PostList
            initialPosts={posts}
            isLoading={isLoading}
            onPostUpdated={loadUserPosts}
          />
        </div>
      </main>

      <CreatePostButton onPostCreated={loadUserPosts} />
    </div>
  );
} 