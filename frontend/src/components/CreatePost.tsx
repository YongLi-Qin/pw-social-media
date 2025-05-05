import { useState, useEffect, FormEvent } from 'react';
import { createPost, getRankingsByGameType, GameType, GameRanking,gameTypeToBackend } from '../services/api';
import { toast } from 'react-toastify';
import { SiLeagueoflegends, SiValorant, SiRiotgames } from 'react-icons/si';

export default function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
  const [content, setContent] = useState('');
  const [gameType, setGameType] = useState<GameType>(GameType.GENERAL);
  const [rankings, setRankings] = useState<GameRanking[]>([]);
  const [selectedRankingId, setSelectedRankingId] = useState<number | null>(null);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  // 当游戏类型改变时加载排名
  useEffect(() => {
    if (gameType !== GameType.GENERAL) {
      loadRankings(gameType);
    } else {
      setRankings([]);
      setSelectedRankingId(null);
    }
  }, [gameType]);

  const loadRankings = async (type: GameType) => {
    try {
      setIsLoadingRankings(true);
      const data = await getRankingsByGameType(type);
      setRankings(data);
    } catch (error) {
      console.error('Failed to load rankings:', error);
      toast.error('Failed to load game rankings');
    } finally {
      setIsLoadingRankings(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);

    await createPost({ 
      content, 
      gameType: gameTypeToBackend[gameType],
      rankingId: selectedRankingId || undefined 
    });
      setContent('');
      setSelectedRankingId(null);
      toast.success('Post created successfully!');
      onPostCreated(); 
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRankingImagePath = (gameType: GameType, rankingName: string): string => {
    if (gameType === GameType.LEAGUE_OF_LEGENDS) {
      // For League of Legends, use the original path and naming
      return `/images/lol-ranking/lol-${rankingName.toLowerCase()}.png`;
    } else if (gameType === GameType.VALORANT) {
      // For Valorant, use the new path and naming convention
      if (rankingName === 'Radiant') {
        return `/images/Valorant-ranking/Radiant_Rank.png`;
      } else {
        // Extract rank name and number (e.g., "Iron 1" -> "Iron_1_rank")
        const [rankBase, rankNumber] = rankingName.split(' ');
        return `/images/Valorant-ranking/${rankBase}_${rankNumber}_Rank.png`;
      }
    }
    return '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create a Post</h2>
      
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
          rows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Game selection */}
            <div className="flex items-center space-x-2">
              <label className="text-base text-gray-700 font-medium">Game:</label>
              <div className="relative">
                <select
                  value={gameType}
                  onChange={(e) => {
                    setGameType(e.target.value as GameType);
                    setSelectedRankingId(null);
                  }}
                  className="pl-10 pr-6 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base bg-white"
                >
                  <option value={GameType.GENERAL}>All Games</option>
                  <option value={GameType.LEAGUE_OF_LEGENDS}>League of Legends</option>
                  <option value={GameType.VALORANT}>VALORANT</option>
                </select>
                <div className="absolute left-3 top-2.5 pointer-events-none text-xl">
                  {gameType === GameType.GENERAL && <SiRiotgames className="text-gray-500" />}
                  {gameType === GameType.LEAGUE_OF_LEGENDS && <SiLeagueoflegends className="text-yellow-500" />}
                  {gameType === GameType.VALORANT && <SiValorant className="text-red-500" />}
                </div>
              </div>
            </div>
            
            {/* Rank selection */}
            {gameType !== GameType.GENERAL && (
              <div className="flex items-center space-x-2">
                <label className="text-base text-gray-700 font-medium">Rank:</label>
                <select
                  value={selectedRankingId || ""}
                  onChange={(e) => setSelectedRankingId(e.target.value ? Number(e.target.value) : null)}
                  disabled={isLoadingRankings || rankings.length === 0}
                  className="pr-6 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base bg-white min-w-[180px]"
                >
                  <option value="">Select rank (optional)</option>
                  {rankings.map(rank => (
                    <option key={rank.id} value={rank.id} className="flex items-center">
                      {rank.rankingName}
                    </option>
                  ))}
                </select>
                {isLoadingRankings && (
                  <span className="text-sm text-gray-500">Loading...</span>
                )}
              </div>
            )}
          </div>
          
          {/* Selected rank display */}
          {selectedRankingId && (
            <div className="flex items-center bg-blue-50 p-4 rounded-lg">
              <span className="text-lg text-gray-700 mr-4 font-medium">Selected rank:</span>
              <div className="flex items-center">
                <img 
                  src={getRankingImagePath(
                    gameType, 
                    rankings.find(r => r.id === selectedRankingId)?.rankingName || ''
                  )} 
                  alt="Rank"
                  className="w-14 h-14 mr-3"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-lg font-medium text-blue-800">
                  {rankings.find(r => r.id === selectedRankingId)?.rankingName}
                </span>
              </div>
            </div>
          )}
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className={`px-6 py-3 rounded-lg text-base ${
                isSubmitting || !content.trim()
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition duration-200 ease-in-out font-medium`}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 