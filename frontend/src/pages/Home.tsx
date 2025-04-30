import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { GameType } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);

  const handleGameTypeSelect = (gameType: GameType) => {
    setSelectedGameType(gameType);
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navbar 
        selectedGameType={selectedGameType}
        onGameTypeSelect={handleGameTypeSelect}
      />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* 左侧标语 */}
          <div className="lg:w-1/3 text-white">
            <h1 className="text-6xl font-bold space-y-4">
              <div>INSIGHT TO</div>
              <div>
                <span className="bg-red-600 px-4 py-1">EVOLVE YOUR</span>
              </div>
              <div>GAME AND</div>
              <div className="text-gray-400">SO MUCH MORE.</div>
            </h1>
            <div className="mt-12 space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold">300M+</span>
                <span className="text-gray-400 text-xl">PLAYERS TRACKED</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold">25M+</span>
                <span className="text-gray-400 text-xl">MATCHES PAST 24 HRS</span>
              </div>
            </div>
          </div>

          {/* 右侧游戏网格 */}
          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">ALL GAMES</h2>
              <div className="text-gray-400">Sort by Popularity</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Valorant */}
              <div 
                onClick={() => navigate('/games/valorant')}
                className="relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-200 hover:scale-105"
              >
                <img 
                  src="/images/valoran_cover.jpg" 
                  alt="Valorant" 
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">VALORANT</h3>
                </div>
              </div>

              {/* League of Legends */}
              <div 
                onClick={() => navigate('/games/league-of-legends')}
                className="relative overflow-hidden rounded-lg cursor-pointer transform transition-all duration-200 hover:scale-105"
              >
                <img 
                  src="/images/lol_cover.jpg" 
                  alt="League of Legends" 
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">League of Legends</h3>
                </div>
              </div>

              {/* 可以继续添加更多游戏卡片 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 