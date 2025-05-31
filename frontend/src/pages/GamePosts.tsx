import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaSync, FaFire, FaTrophy, FaUsers, FaInfoCircle, FaCalendarAlt, FaChartLine, FaChevronLeft, FaChevronRight, FaArrowUp } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import PostList from '../components/PostList';
import CreatePostButton from '../components/CreatePostButton';
import RankingFilter from '../components/RankingFilter';
import { getAllPosts, getPostsByGameType, GameType, urlToGameType, Post } from '../services/api';
import { toast } from 'react-toastify';

export default function GamePosts() {
  const { gameType: gameTypeParam } = useParams<{ gameType: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [selectedRankings, setSelectedRankings] = useState<number[]>([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<'all' | 'following'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
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

  // 监听滚动显示回到顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadPosts = async (gameType: GameType | null = null) => {
    try {
      setIsLoading(true);
      let data: Post[];
      
      if (gameType && gameType !== GameType.GENERAL) {
        data = await getPostsByGameType(gameType);
      } else {
        data = await getAllPosts() as Post[];
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

  const loadFollowingPosts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/posts/following', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFilteredPosts(data);
    } catch (error) {
      console.error('Error loading following posts:', error);
      toast.error('Failed to load following posts');
    } finally {
      setIsLoading(false);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const postsPerPage = 10;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-zinc-900 relative overflow-hidden">
      {/* 背景动画粒子 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-float-delayed opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-green-400 rounded-full animate-float-slow opacity-20"></div>
      </div>

      <Navbar 
        selectedGameType={selectedGameType}
        onGameTypeSelect={handleGameTypeSelect}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧边栏 - 添加粘性定位 */}
          <div className={`lg:w-1/4 transition-all duration-1000 ${
            isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="sticky top-24 space-y-6">
              <div className="bg-zinc-800 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaInfoCircle className="mr-2 text-blue-400 animate-pulse" />
                  Game Info
                </h3>
                {selectedGameType === GameType.VALORANT && (
                  <div className="text-gray-300 space-y-3 animate-fade-in">
                    <p className="leading-relaxed">Valorant is a free-to-play first-person tactical hero shooter developed and published by Riot Games.</p>
                    <div className="flex items-center text-sm group">
                      <FaCalendarAlt className="mr-2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                      <span className="group-hover:text-white transition-colors duration-300">Released: June 2, 2020</span>
                    </div>
                    <div className="flex items-center text-sm group">
                      <FaUsers className="mr-2 text-gray-400 group-hover:text-green-400 transition-colors duration-300" />
                      <span className="group-hover:text-white transition-colors duration-300">Active Players: 25M+</span>
                    </div>
                  </div>
                )}
                {selectedGameType === GameType.LEAGUE_OF_LEGENDS && (
                  <div className="text-gray-300 space-y-3 animate-fade-in">
                    <p className="leading-relaxed">League of Legends is a team-based strategy game where two teams of five champions face off to destroy the other's base.</p>
                    <div className="flex items-center text-sm group">
                      <FaCalendarAlt className="mr-2 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                      <span className="group-hover:text-white transition-colors duration-300">Released: October 27, 2009</span>
                    </div>
                    <div className="flex items-center text-sm group">
                      <FaUsers className="mr-2 text-gray-400 group-hover:text-green-400 transition-colors duration-300" />
                      <span className="group-hover:text-white transition-colors duration-300">Active Players: 180M+</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-zinc-800 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaTrophy className="mr-2 text-yellow-400 animate-bounce" />
                  Top Players
                </h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'ProPlayer123', points: 2345, delay: '0.1s' },
                    { rank: 2, name: 'GameMaster', points: 2120, delay: '0.2s' },
                    { rank: 3, name: 'LegendaryGamer', points: 1987, delay: '0.3s' }
                  ].map((player) => (
                    <div 
                      key={player.rank}
                      className="flex items-center justify-between text-gray-300 p-2 hover:bg-zinc-700 rounded transition-all duration-300 hover:transform hover:translate-x-2 animate-slide-in-left"
                      style={{ animationDelay: player.delay }}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${player.rank === 1 ? 'bg-yellow-500' : player.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'} rounded-full flex items-center justify-center text-white font-bold transform hover:rotate-12 transition-transform duration-300`}>
                          {player.rank}
                        </div>
                        <span className="ml-3 hover:text-white transition-colors duration-300">{player.name}</span>
                      </div>
                      <span className="text-yellow-400 font-bold animate-pulse">{player.points.toLocaleString()} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 中间内容区 */}
          <div className={`lg:w-2/4 transition-all duration-1000 delay-300 ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white relative">
                {currentView === 'following' 
                  ? 'Following Posts' 
                  : selectedGameType 
                  ? `${selectedGameType.replace(/-/g, ' ')} Posts` 
                  : 'All Posts'}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 animate-expand-width"></div>
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCurrentView('all');
                    loadPosts(selectedGameType);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    currentView === 'all' ? 'bg-blue-700 shadow-lg shadow-blue-500/30' : 'bg-blue-600'
                  } text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  <FaSync className={`${isLoading ? 'animate-spin' : ''} transition-transform duration-300`} />
                  <span>{isLoading ? 'Refreshing...' : 'All Posts'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('following');
                    loadFollowingPosts();
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    currentView === 'following' ? 'bg-green-700 shadow-lg shadow-green-500/30' : 'bg-green-600'
                  } text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/40`}
                >
                  <FaUsers className="transition-transform duration-300 hover:scale-110" />
                  <span>Following</span>
                </button>
              </div>
            </div>

            {/* 排名筛选仅在 All 视图中显示 */}
            {currentView === 'all' && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <RankingFilter 
                  onFilterChange={handleFilterChange} 
                  selectedGameType={selectedGameType}
                />
              </div>
            )}

            {/* 帖子加载状态 */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <div className="animate-ping absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full h-12 w-12 border-2 border-blue-300 opacity-20"></div>
                </div>
                <p className="mt-4 text-gray-400 animate-pulse">Loading posts...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                {selectedRankings.length > 0 && currentView === 'all' && (
                  <div className="mb-4 text-sm text-gray-400 animate-slide-in-right">
                    Showing <span className="text-blue-400 font-bold">{filteredPosts.length}</span> filtered posts
                  </div>
                )}
                <PostList posts={currentPosts} onPostUpdated={() => {
                  currentView === 'following' ? loadFollowingPosts() : loadPosts(selectedGameType);
                }} />

                {/* 分页组件 */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center px-3 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                      <FaChevronLeft className="mr-1" />
                      Previous
                    </button>

                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                            currentPage === page
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                              : 'bg-zinc-700 text-gray-300 hover:bg-zinc-600 hover:text-white'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center px-3 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                    >
                      Next
                      <FaChevronRight className="ml-1" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-zinc-800 rounded-lg shadow p-8 text-center transform hover:scale-105 transition-all duration-300 animate-fade-in">
                <div className="text-6xl mb-4 opacity-20">🎮</div>
                <p className="text-gray-400">
                  {currentView === 'following'
                    ? 'You are not following anyone yet.'
                    : selectedRankings.length > 0
                      ? 'No posts match your selected filters.'
                      : 'No posts yet. Be the first to post!'}
                </p>
              </div>
            )}
          </div>

          {/* 右侧边栏 - 添加粘性定位 */}
          <div className={`lg:w-1/4 transition-all duration-1000 delay-500 ${
            isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="sticky top-24 space-y-6">
              <div className="bg-zinc-800 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaFire className="mr-2 text-red-500 animate-pulse" />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {[
                    { tag: 'NewUpdate', posts: 125, delay: '0.1s' },
                    { tag: 'ProTips', posts: 98, delay: '0.2s' },
                    { tag: 'TeamRecruitment', posts: 87, delay: '0.3s' }
                  ].map((topic) => (
                    <div 
                      key={topic.tag}
                      className="p-2 bg-zinc-700 rounded hover:bg-zinc-600 cursor-pointer transition-all duration-300 hover:transform hover:translate-x-2 animate-slide-in-right"
                      style={{ animationDelay: topic.delay }}
                    >
                      <span className="text-blue-400 font-bold">#</span>
                      <span className="text-gray-200 hover:text-white transition-colors duration-300">{topic.tag}</span>
                      <p className="text-sm text-gray-400 mt-1">
                        <span className="text-green-400 font-bold animate-pulse">{topic.posts}</span> posts this week
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg shadow-lg p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-green-500 animate-bounce" />
                  Community Stats
                </h3>
                <div className="space-y-4 text-gray-300">
                  <div className="flex justify-between items-center group">
                    <span className="group-hover:text-white transition-colors duration-300">Total Posts:</span>
                    <span className="font-bold text-blue-400 animate-pulse">{posts.length}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="group-hover:text-white transition-colors duration-300">Active Users:</span>
                    <span className="font-bold text-green-400 animate-pulse">1,245</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="group-hover:text-white transition-colors duration-300">Posts Today:</span>
                    <span className="font-bold text-yellow-400 animate-pulse">87</span>
                  </div>
                  <div className="w-full bg-zinc-700 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full animate-progress-bar" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-center text-gray-400 animate-fade-in">
                    Community activity is <span className="text-green-400 font-bold">65%</span> higher than last week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 页脚 */}
      <footer className="bg-zinc-800 border-t border-zinc-700 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">Gaming Social</h3>
              <p className="text-gray-400">Connect with fellow gamers and share your gaming moments.</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors duration-300 cursor-pointer">
                  <span className="text-white text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors duration-300 cursor-pointer">
                  <span className="text-white text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors duration-300 cursor-pointer">
                  <span className="text-white text-sm">d</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Games</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Valorant</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">League of Legends</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">CS:GO</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Overwatch</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Forums</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Discord</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Events</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Tournaments</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Help Center</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Contact Us</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors duration-300 cursor-pointer">Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gaming Social. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <CreatePostButton onPostCreated={() => loadPosts(selectedGameType)} />

      {/* 回到顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
        >
          <FaArrowUp />
        </button>
      )}

      {/* 添加CSS动画样式 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes expand-width {
          from { width: 0; }
          to { width: 100%; }
        }

        @keyframes progress-bar {
          from { width: 0; }
          to { width: 65%; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-expand-width {
          animation: expand-width 1s ease-out forwards 0.5s;
        }

        .animate-progress-bar {
          animation: progress-bar 2s ease-out forwards 1s;
          width: 0;
        }
      `}</style>
    </div>
  );
} 