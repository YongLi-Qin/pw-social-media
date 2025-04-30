import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostList from '../components/PostList';
import PostItem from '../components/PostItem';
import CreatePostButton from '../components/CreatePostButton';
import { getUserPosts, getUserProfile, GameType } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import { FaHome, FaUserCircle, FaCalendarAlt, FaGamepad, FaTrophy, FaCamera, FaUser, FaSignOutAlt, FaEdit, FaChartLine } from 'react-icons/fa';
import { SiRiotgames, SiLeagueoflegends, SiValorant } from 'react-icons/si';
import Navbar from '../components/Navbar';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export default function Profile() {
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    favoriteGame: 'Valorant',
    joinDate: 'March 2024',
    achievements: [
      { name: 'First Post', description: 'Created your first post', earned: true },
      { name: 'Regular Contributor', description: 'Posted 10 times', earned: false },
      { name: 'Community Favorite', description: 'Received 50 likes', earned: false },
    ]
  });
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // 从API获取用户资料
    fetchUserProfile();
    loadUserPosts();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('User profile from API:', response.data);
      setUser(response.data);
      
      // 更新本地存储中的用户数据
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // 如果API请求失败，尝试使用本地存储的数据作为备份
      const userJson = localStorage.getItem('user');
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    }
  };

  const handleAvatarClick = () => {
    document.getElementById('avatar-input')?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:8000/api/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      console.log('Upload response:', data); // 调试用
      
      // 更新本地用户信息
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, avatar: data.avatarUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Avatar updated successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const loadUserPosts = async () => {
    setIsLoading(true);
    try {
      const posts = await getUserPosts();
      setUserPosts(posts);
      setStats(prev => ({
        ...prev,
        totalPosts: posts.length,
        totalComments: posts.reduce((total, post) => total + (post.commentCount || 0), 0)
      }));
    } catch (error) {
      toast.error('Failed to load posts');
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameTypeSelect = (gameType: GameType) => {
    setSelectedGameType(gameType);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderAvatar = () => {
    if (!user) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl">
          U
        </div>
      );
    }

    if (!user.avatar || imageError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      );
    }

    return (
      <img 
        src={user.avatar} 
        alt={user.name} 
        className="w-full h-full object-cover" 
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* 使用我们的 Navbar 组件 */}
      <Navbar 
        selectedGameType={selectedGameType}
        onGameTypeSelect={handleGameTypeSelect}
      />

      {/* 用户信息卡片 */}
      <div className="relative">
        {/* 封面图 */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        
        {/* 用户信息 */}
        <div className="max-w-5xl mx-auto px-4 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 relative">
            {/* 头像 */}
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-4 border-zinc-900 overflow-hidden bg-zinc-800">
                {renderAvatar()}
              </div>
              <button className="absolute bottom-2 right-2 bg-zinc-700 p-2 rounded-full text-white hover:bg-zinc-600">
                <FaCamera />
              </button>
            </div>
            
            {/* 用户信息 */}
            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-grow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                  <div className="flex items-center justify-center md:justify-start mt-2 text-gray-400">
                    <FaCalendarAlt className="mr-2" />
                    <span>Joined {stats.joinDate}</span>
                  </div>
                </div>
                <button className="mt-4 md:mt-0 flex items-center justify-center space-x-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200">
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                <div className="bg-zinc-800 px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold text-white">{stats.totalPosts}</div>
                  <div className="text-sm text-gray-400">Posts</div>
                </div>
                <div className="bg-zinc-800 px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold text-white">{stats.totalComments}</div>
                  <div className="text-sm text-gray-400">Comments</div>
                </div>
                <div className="bg-zinc-800 px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧边栏 */}
          <div className="md:w-1/4">
            <div className="bg-zinc-800 rounded-lg shadow-lg p-4 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-400" />
                About Me
              </h3>
              <div className="text-gray-300 space-y-3">
                <p className="italic text-gray-400">No bio yet. Click Edit Profile to add one.</p>
                <div className="pt-2">
                  <div className="flex items-center text-sm mb-2">
                    <span className="text-gray-400 w-24">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center text-sm mb-2">
                    <span className="text-gray-400 w-24">Favorite Game:</span>
                    <span>{stats.favoriteGame}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-400 w-24">User ID:</span>
                    <span>{user?.id}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FaTrophy className="mr-2 text-yellow-400" />
                Achievements
              </h3>
              <div className="space-y-3">
                {stats.achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${achievement.earned ? 'bg-zinc-700' : 'bg-zinc-900 opacity-50'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-yellow-500' : 'bg-zinc-700'} text-white`}>
                        <FaTrophy />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-white">{achievement.name}</div>
                        <div className="text-sm text-gray-400">{achievement.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧内容区 */}
          <div className="md:w-3/4">
            {/* 标签页导航 */}
            <div className="border-b border-zinc-700 mb-6">
              <div className="flex space-x-8">
                <button 
                  onClick={() => setActiveTab('posts')}
                  className={`py-4 px-1 font-medium text-sm focus:outline-none ${
                    activeTab === 'posts' 
                      ? 'text-blue-500 border-b-2 border-blue-500' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  My Posts
                </button>
              </div>
            </div>

            {/* 标签页内容 */}
            {activeTab === 'posts' && (
              <>
                <h2 className="text-xl font-semibold text-gray-300 mb-6">My Posts</h2>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-400">Loading posts...</p>
                  </div>
                ) : userPosts.length > 0 ? (
                  <PostList posts={userPosts} onPostUpdated={loadUserPosts} />
                ) : (
                  <div className="bg-zinc-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-400">You haven't created any posts yet.</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      Create Your First Post
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'stats' && (
              <>
                <h2 className="text-xl font-semibold text-gray-300 mb-6">Activity Stats</h2>
                <div className="bg-zinc-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <FaChartLine className="mr-2 text-green-500" />
                    Engagement Overview
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-zinc-700 rounded-lg p-4">
                      <div className="text-gray-400 mb-2">Total Posts</div>
                      <div className="text-3xl font-bold text-white">{stats.totalPosts}</div>
                      <div className="w-full bg-zinc-600 h-2 rounded-full mt-4">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(stats.totalPosts * 10, 100)}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">10% of the way to Regular Contributor</div>
                    </div>
                    
                    <div className="bg-zinc-700 rounded-lg p-4">
                      <div className="text-gray-400 mb-2">Total Comments</div>
                      <div className="text-3xl font-bold text-white">{stats.totalComments}</div>
                      <div className="w-full bg-zinc-600 h-2 rounded-full mt-4">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(stats.totalComments * 5, 100)}%` }}></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">5% of the way to Active Commenter</div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-3">Activity by Game</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">Valorant</span>
                        <span className="text-gray-400">75%</span>
                      </div>
                      <div className="w-full bg-zinc-600 h-2 rounded-full">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">League of Legends</span>
                        <span className="text-gray-400">25%</span>
                      </div>
                      <div className="w-full bg-zinc-600 h-2 rounded-full">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <CreatePostButton onPostCreated={loadUserPosts} />

      {/* 调试信息 */}
      <div className="hidden">
        <p>User: {JSON.stringify(user)}</p>
        <p>Image Error: {imageError.toString()}</p>
        <p>Image URL: {user?.avatar}</p>
        <p>Cleaned URL: {user?.avatar?.replace(/["']/g, '')}</p>
      </div>
    </div>
  );
} 