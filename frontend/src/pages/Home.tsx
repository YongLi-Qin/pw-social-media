import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { GameType } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleGameTypeSelect = (gameType: GameType) => {
    setSelectedGameType(gameType);
  };

  return (
    <div className="min-h-screen bg-zinc-900 overflow-hidden">
      <Navbar 
        selectedGameType={selectedGameType}
        onGameTypeSelect={handleGameTypeSelect}
      />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* 左侧标语 - 添加渐入和滑入动画 */}
          <div className={`lg:w-1/3 text-white transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <h1 className="text-6xl font-bold space-y-4">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>INSIGHT TO</div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <span className="bg-red-600 px-4 py-1 relative overflow-hidden group">
                  <span className="relative z-10">EVOLVE YOUR</span>
                  <div className="absolute inset-0 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </span>
              </div>
              <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>GAME AND</div>
              <div className="text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>SO MUCH MORE.</div>
            </h1>
            
            {/* 统计数据 - 添加计数动画 */}
            <div className={`mt-12 space-y-4 transition-all duration-1000 delay-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}>
              <div className="flex items-baseline gap-4 group">
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                  300M+
                </span>
                <span className="text-gray-400 text-xl group-hover:text-white transition-colors duration-300">
                  PLAYERS TRACKED
                </span>
              </div>
              <div className="flex items-baseline gap-4 group">
                <span className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
                  25M+
                </span>
                <span className="text-gray-400 text-xl group-hover:text-white transition-colors duration-300">
                  MATCHES PAST 24 HRS
                </span>
              </div>
            </div>
          </div>

          {/* 右侧游戏网格 - 添加交错动画 */}
          <div className={`lg:w-2/3 transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white relative">
                ALL GAMES
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 animate-expand-width"></div>
              </h2>
              <div className="text-gray-400 hover:text-white transition-colors duration-300">
                Sort by Popularity
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Valorant */}
              <div 
                onClick={() => navigate('/games/valorant')}
                className="relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:rotate-1 group animate-fade-in-up"
                style={{ animationDelay: '1.2s' }}
              >
                <img 
                  src="/images/valoran_cover.jpg" 
                  alt="Valorant" 
                  className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                    VALORANT
                  </h3>
                </div>
                {/* 悬停时的光效 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
              </div>

              {/* League of Legends */}
              <div 
                onClick={() => navigate('/games/league-of-legends')}
                className="relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-rotate-1 group animate-fade-in-up"
                style={{ animationDelay: '1.4s' }}
              >
                <img 
                  src="/images/lol_cover.jpg" 
                  alt="League of Legends" 
                  className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    League of Legends
                  </h3>
                </div>
                {/* 悬停时的光效 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
              </div>

              {/* 可以继续添加更多游戏卡片 */}
            </div>
          </div>
        </div>
      </div>

      {/* 添加CSS动画样式 */}
      <style jsx>{`
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

        @keyframes expand-width {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-expand-width {
          animation: expand-width 1s ease-out forwards 1.5s;
        }
      `}</style>
    </div>
  );
} 