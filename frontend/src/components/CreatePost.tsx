import { useState, useEffect, FormEvent } from 'react';
import { createPost, getRankingsByGameType, GameType, GameRanking } from '../services/api';
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
        gameType,
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

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="mt-3 flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 font-medium">Game:</label>
              <div className="relative">
                <select
                  value={gameType}
                  onChange={(e) => {
                    setGameType(e.target.value as GameType);
                    setSelectedRankingId(null);
                  }}
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value={GameType.GENERAL}>All Games</option>
                  <option value={GameType.LEAGUE_OF_LEGENDS}>League of Legends</option>
                  <option value={GameType.VALORANT}>VALORANT</option>
                </select>
                <div className="absolute left-2 top-2 pointer-events-none">
                  {gameType === GameType.GENERAL && <SiRiotgames className="text-gray-500" />}
                  {gameType === GameType.LEAGUE_OF_LEGENDS && <SiLeagueoflegends className="text-yellow-500" />}
                  {gameType === GameType.VALORANT && <SiValorant className="text-red-500" />}
                </div>
              </div>
            </div>
            
            {gameType !== GameType.GENERAL && (
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 font-medium">Rank:</label>
                <select
                  value={selectedRankingId || ""}
                  onChange={(e) => setSelectedRankingId(e.target.value ? Number(e.target.value) : null)}
                  disabled={isLoadingRankings || rankings.length === 0}
                  className="pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Select rank (optional)</option>
                  {rankings.map(rank => (
                    <option key={rank.id} value={rank.id}>
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
          
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={`px-4 py-2 rounded-lg ${
              isSubmitting || !content.trim()
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition duration-200 ease-in-out font-medium`}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
} 