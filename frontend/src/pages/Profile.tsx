import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import PostItem from '../components/PostItem';
import CreatePostButton from '../components/CreatePostButton';
import { getUserPosts } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import { FaHome, FaUserCircle, FaCalendarAlt, FaGamepad, FaTrophy } from 'react-icons/fa';
import { SiRiotgames, SiLeagueoflegends, SiValorant } from 'react-icons/si';

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
    <div className="min-h-screen bg-zinc-100">
      <ToastContainer />
      {/* 导航栏 - 与Home页面保持一致 */}
      <nav className="bg-zinc-900 sticky top-0 z-10 shadow-md">
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

      {/* 欢迎横幅 - 与Home页面保持一致的样式 */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt="User Profile" 
                  className="w-24 h-24 rounded-full border-2 border-zinc-600"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-zinc-700 flex items-center justify-center">
                  <FaUserCircle className="w-16 h-16 text-zinc-400" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {user?.name || 'Loading...'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-zinc-400">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>Joined March 2024</span>
                </div>
                <div className="flex items-center">
                  <FaGamepad className="mr-2" />
                  <span>{posts.length} posts</span>
                </div>
                <div className="flex items-center">
                  <FaTrophy className="mr-2" />
                  <span>Gaming Enthusiast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 - 与Home页面保持一致的样式 */}
      <main className="max-w-2xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-800">
            My Posts
          </h2>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div>
            {posts.map(post => (
              <PostItem key={post.id} post={post} onPostUpdated={loadUserPosts} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FaGamepad className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="mt-1 text-gray-500">Get started by creating your first gaming post!</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/home')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}
      </main>

      <CreatePostButton onPostCreated={loadUserPosts} />
    </div>
  );
} 