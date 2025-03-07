import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import CreatePostButton from '../components/CreatePostButton';
import { getUserPosts } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import { FaHome, FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import { SiRiotgames } from 'react-icons/si';

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    picture?: string;
    googleId?: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 从localStorage获取用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

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
    <div className="min-h-screen bg-zinc-900">
      <ToastContainer />
      {/* 导航栏 */}
      <nav className="bg-zinc-800 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <SiRiotgames className="text-red-500 text-2xl" />
              <span className="text-xl font-bold text-white">Gaming Social</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                         bg-blue-600 text-white hover:bg-blue-700 
                         transition-all duration-200 font-medium"
              >
                <FaHome />
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg 
                         hover:bg-red-700 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 用户信息卡片 */}
      <div className="bg-zinc-800 shadow-lg border-b border-zinc-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt="User Profile" 
                  className="w-24 h-24 rounded-full border-2 border-zinc-600"
                />
              ) : (
                <FaUserCircle className="w-24 h-24 text-zinc-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user?.name || 'Loading...'}
              </h2>
              <div className="flex items-center space-x-4 mt-2 text-zinc-400">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>Joined March 2024</span>
                </div>
                <div>
                  <span className="font-semibold text-zinc-300">{posts.length}</span>
                  <span className="ml-1">posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="max-w-2xl mx-auto py-6 px-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">My Posts</h2>
        </div>
        <PostList
          initialPosts={posts}
          isLoading={isLoading}
          onPostUpdated={loadUserPosts}
        />
      </main>

      <CreatePostButton onPostCreated={loadUserPosts} />
    </div>
  );
} 