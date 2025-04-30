import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaSync, FaFire, FaTrophy, FaUsers, FaInfoCircle, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import PostList from '../components/PostList';
import CreatePostButton from '../components/CreatePostButton';
import RankingFilter from '../components/RankingFilter';
import { getAllPosts, getPostsByGameType, GameType, urlToGameType } from '../services/api';
import { toast } from 'react-toastify';

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    picture: string;
  };
  gameRanking?: {
    id: number;
    rankingName: string;
  };
}

export default function GamePosts() {
  const { gameType: gameTypeParam } = useParams<{ gameType: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [selectedRankings, setSelectedRankings] = useState<number[]>([]);

  useEffect(() => {
    // 将 URL 参数转换为 GameType
    if (gameTypeParam) {
      const currentGameType = urlToGameType(gameTypeParam);
      
      if (currentGameType) {
        setSelectedGameType(currentGameType);
        loadPosts(currentGameType);
      } else {
        console.error(`Unknown game type: ${gameTypeParam}`);
        // 默认加载所有帖子
        setSelectedGameType(GameType.GENERAL);
        loadPosts(GameType.GENERAL);
      }
    } else {
      // 默认加载所有帖子
      setSelectedGameType(GameType.GENERAL);
      loadPosts(GameType.GENERAL);
    }
  }, [gameTypeParam]);

  const loadPosts = async (gameType: GameType | null = null) => {
    try {
      setIsLoading(true);
      let data;
      
      if (gameType && gameType !== GameType.GENERAL) {
        data = await getPostsByGameType(gameType);
      } else {
        data = await getAllPosts();
      }
      
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameTypeSelect = (gameType: GameType) => {
    setSelectedGameType(gameType);
    loadPosts(gameType);
  };

  const handleFilterChange = (rankings: number[]) => {
    setSelectedRankings(rankings);
    if (rankings.length === 0) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.gameRanking && rankings.includes(post.gameRanking.id)
      );
      setFilteredPosts(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar 
        selectedGameType={selectedGameType}
        onGameTypeSelect={handleGameTypeSelect}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧边栏 */}
          <div className="lg:w-1/4">
            <div className="bg-zinc-800 rounded-lg shadow-lg p-4 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-400" />
                Game Info
              </h3>
              {selectedGameType === GameType.VALORANT && (
                <div className="text-gray-300 space-y-3">
                  <p>Valorant is a free-to-play first-person tactical hero shooter developed and published by Riot Games.</p>
                  <div className="flex items-center text-sm">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    <span>Released: June 2, 2020</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaUsers className="mr-2 text-gray-400" />
                    <span>Active Players: 25M+</span>
                  </div>
                </div>
              )}
              {selectedGameType === GameType.LEAGUE_OF_LEGENDS && (
                <div className="text-gray-300 space-y-3">
                  <p>League of Legends is a team-based strategy game where two teams of five champions face off to destroy the other's base.</p>
                  <div className="flex items-center text-sm">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    <span>Released: October 27, 2009</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FaUsers className="mr-2 text-gray-400" />
                    <span>Active Players: 180M+</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-zinc-800 rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaTrophy className="mr-2 text-yellow-400" />
                Top Players
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-gray-300 p-2 hover:bg-zinc-700 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <span className="ml-3">ProPlayer123</span>
                  </div>
                  <span className="text-yellow-400">2,345 pts</span>
                </div>
                <div className="flex items-center justify-between text-gray-300 p-2 hover:bg-zinc-700 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <span className="ml-3">GameMaster</span>
                  </div>
                  <span className="text-yellow-400">2,120 pts</span>
                </div>
                <div className="flex items-center justify-between text-gray-300 p-2 hover:bg-zinc-700 rounded">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <span className="ml-3">LegendaryGamer</span>
                  </div>
                  <span className="text-yellow-400">1,987 pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* 中间内容区 */}
          <div className="lg:w-2/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedGameType ? `${selectedGameType.replace(/-/g, ' ')} Posts` : 'All Posts'}
              </h2>
              <button
                onClick={() => loadPosts(selectedGameType)}
                className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                <FaSync className={isLoading ? 'animate-spin' : ''} />
                <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            <RankingFilter 
              onFilterChange={handleFilterChange} 
              selectedGameType={selectedGameType}
            />

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-400">Loading posts...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div>
                {selectedRankings.length > 0 && (
                  <div className="mb-4 text-sm text-gray-400">
                    Showing {filteredPosts.length} filtered posts
                  </div>
                )}
                <PostList posts={filteredPosts} onPostUpdated={() => loadPosts(selectedGameType)} />
              </div>
            ) : (
              <div className="bg-zinc-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-400">
                  {selectedRankings.length > 0 
                    ? 'No posts match your selected filters.' 
                    : 'No posts yet. Be the first to post!'}
                </p>
              </div>
            )}
          </div>

          {/* 右侧边栏 */}
          <div className="lg:w-1/4">
            <div className="bg-zinc-800 rounded-lg shadow-lg p-4 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaFire className="mr-2 text-red-500" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                <div className="p-2 bg-zinc-700 rounded hover:bg-zinc-600 cursor-pointer">
                  <span className="text-blue-400">#</span>
                  <span className="text-gray-200">NewUpdate</span>
                  <p className="text-sm text-gray-400 mt-1">125 posts this week</p>
                </div>
                <div className="p-2 bg-zinc-700 rounded hover:bg-zinc-600 cursor-pointer">
                  <span className="text-blue-400">#</span>
                  <span className="text-gray-200">ProTips</span>
                  <p className="text-sm text-gray-400 mt-1">98 posts this week</p>
                </div>
                <div className="p-2 bg-zinc-700 rounded hover:bg-zinc-600 cursor-pointer">
                  <span className="text-blue-400">#</span>
                  <span className="text-gray-200">TeamRecruitment</span>
                  <p className="text-sm text-gray-400 mt-1">87 posts this week</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaChartLine className="mr-2 text-green-500" />
                Community Stats
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between items-center">
                  <span>Total Posts:</span>
                  <span className="font-bold">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Users:</span>
                  <span className="font-bold">1,245</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Posts Today:</span>
                  <span className="font-bold">87</span>
                </div>
                <div className="w-full bg-zinc-700 h-2 rounded-full mt-4">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-center text-gray-400">Community activity is 65% higher than last week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreatePostButton onPostCreated={() => loadPosts(selectedGameType)} />
    </div>
  );
} 