import { useNavigate } from 'react-router-dom';
import { SiRiotgames, SiLeagueoflegends, SiValorant } from 'react-icons/si';
import { FaUser } from 'react-icons/fa';
import { GameType } from '../services/api';

interface NavbarProps {
  selectedGameType: GameType | null;
  onGameTypeSelect: (gameType: GameType) => void;
}

export default function Navbar({ selectedGameType, onGameTypeSelect }: NavbarProps) {
  const navigate = useNavigate();

  const handleGameSelect = (gameType: GameType) => {
    onGameTypeSelect(gameType);
    
    if (gameType === GameType.GENERAL) {
      navigate('/');
    } else {
      navigate(`/games/${gameType}`);
    }
  };

  console.log('League of Legends enum value:', GameType.LEAGUE_OF_LEGENDS);
  console.log('Valorant enum value:', GameType.VALORANT);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* 导航栏 */}
      <nav className="bg-zinc-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            {/* Logo 区域 */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <SiRiotgames className="text-red-500 text-2xl" />
              <span className="text-xl font-bold text-white">Gaming Social</span>
            </div>

            {/* 游戏分类 */}
            <div className="flex-1 flex items-center justify-center space-x-8">
              <button 
                onClick={() => handleGameSelect(GameType.GENERAL)}
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
                onClick={() => {
                  onGameTypeSelect(GameType.LEAGUE_OF_LEGENDS);
                  navigate('/games/league-of-legends');
                }}
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
                onClick={() => {
                  onGameTypeSelect(GameType.VALORANT);
                  navigate('/games/valorant');
                }}
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
                onClick={handleLogout}
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
            {selectedGameType ? `${selectedGameType.replace(/-/g, ' ').toUpperCase()} Community` : 'Welcome to Gaming Social'}
          </h2>
          <p className="text-zinc-400">
            {selectedGameType ? 'Connect with fellow gamers and share your moments' : 'Connect with gamers, share your moments'}
          </p>
        </div>
      </div>
    </>
  );
}