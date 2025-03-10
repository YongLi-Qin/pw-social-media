import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import CreatePostButton from '../components/CreatePostButton';
import { getAllPosts, getPostsByGameType, GameType } from '../services/api';
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
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const navigate = useNavigate();

  const loadPosts = async (gameType: GameType | null = null) => {
    try {
      setIsLoading(true);
      let data;
      
      if (gameType && gameType !== GameType.GENERAL) {
        console.log(`Loading posts for game type: ${gameType}`);
        data = await getPostsByGameType(gameType);
      } else {
        console.log('Loading all posts');
        data = await getAllPosts();
      }
      
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(selectedGameType);
  }, [selectedGameType]);

  const handleGameTypeSelect = (gameType: GameType) => {
    setSelectedGameType(gameType === selectedGameType ? null : gameType);
  };

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

            {/* 游戏分类 */}
            <div className="flex-1 flex items-center justify-center space-x-8">
              <button 
                onClick={() => handleGameTypeSelect(GameType.GENERAL)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg 
                           ${selectedGameType === GameType.GENERAL || selectedGameType === null 
                             ? 'bg-zinc-700 text-white' 
                             : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'} 
                           transition-all duration-200`}
              >
                <SiRiotgames className="text-red-500" />
                <span>All Games</span>
              </button>
              
              <button 
                onClick={() => handleGameTypeSelect(GameType.LEAGUE_OF_LEGENDS)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg 
                           ${selectedGameType === GameType.LEAGUE_OF_LEGENDS 
                             ? 'bg-zinc-700 text-white' 
                             : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'} 
                           transition-all duration-200`}
              >
                <SiLeagueoflegends className="text-yellow-500" />
                <span>League of Legends</span>
              </button>
              
              <button 
                onClick={() => handleGameTypeSelect(GameType.VALORANT)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg 
                           ${selectedGameType === GameType.VALORANT 
                             ? 'bg-zinc-700 text-white' 
                             : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'} 
                           transition-all duration-200`}
              >
                <SiValorant className="text-red-500" />
                <span>VALORANT</span>
              </button>
            </div>

            {/* 用户操作区 */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg 
                         bg-blue-600 text-white hover:bg-blue-700 
                         transition-all duration-200 font-medium"
              >
                <FaUser />
                <span>Profile</span>
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

      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">
            {selectedGameType ? `${selectedGameType.replace('_', ' ')} Community` : 'Welcome to Gaming Social'}
          </h2>
          <p className="text-zinc-400">
            {selectedGameType ? 'Connect with fellow gamers and share your moments' : 'Connect with gamers, share your moments'}
          </p>
        </div>
      </div>

      {/* 主要内容 */}
      <main className="max-w-2xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-800">
            {selectedGameType ? `${selectedGameType.replace('_', ' ')} Posts` : 'Recent Posts'}
          </h2>
          {selectedGameType && (
            <button 
              onClick={() => setSelectedGameType(null)}
              className="px-3 py-1 bg-zinc-200 hover:bg-zinc-300 rounded-full text-sm text-zinc-800"
            >
              Clear Filter
            </button>
          )}
        </div>
        <PostList
          initialPosts={posts}
          isLoading={isLoading}
          onPostUpdated={() => loadPosts(selectedGameType)}
        />
      </main>

      <CreatePostButton onPostCreated={() => loadPosts(selectedGameType)} />
    </div>
  );
} 