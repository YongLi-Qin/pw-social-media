import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import CreatePostButton from '../components/CreatePostButton';
import { getAllPosts } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { SiRiotgames, SiLeagueoflegends, SiValorant } from 'react-icons/si';

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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadAllPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to load posts');
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllPosts();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100">
      <ToastContainer />
      {/* 导航栏 */}
      <nav className="bg-zinc-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            {/* Logo 区域 */}
            <div className="flex items-center space-x-3">
              <SiRiotgames className="text-red-500 text-2xl" />
              <span className="text-xl font-bold text-white">Gaming Social</span>
            </div>

            {/* 游戏分类 - 更新样式 */}
            <div className="flex-1 flex items-center justify-center space-x-8">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                               bg-zinc-800 text-gray-300 hover:bg-zinc-700 
                               transition-all duration-200 group">
                <SiLeagueoflegends className="text-xl text-yellow-500" />
                <span className="group-hover:text-yellow-500">League of Legends</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                               bg-zinc-800 text-gray-300 hover:bg-zinc-700 
                               transition-all duration-200 group">
                <SiValorant className="text-xl text-red-500" />
                <span className="group-hover:text-red-500">VALORANT</span>
              </button>
            </div>

            {/* 用户操作区 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <FaUser />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/login');
                }}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg 
                         hover:bg-gray-800 hover:border-gray-500 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Welcome to Gaming Social</h2>
          <p className="text-zinc-400">Connect with gamers, share your moments</p>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="max-w-2xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-800">Recent Posts</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-zinc-800 text-white rounded-full font-medium hover:bg-zinc-700">
              All Posts
            </button>
            <button className="px-4 py-2 text-zinc-600 hover:bg-zinc-200 rounded-full font-medium">
              Following
            </button>
          </div>
        </div>
        <PostList
          initialPosts={posts}
          isLoading={isLoading}
          onPostUpdated={loadAllPosts}
        />
      </main>

      <CreatePostButton onPostCreated={loadAllPosts} />
    </div>
  );
} 