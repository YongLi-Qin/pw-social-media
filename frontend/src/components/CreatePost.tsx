import { useState, FormEvent } from 'react';
import { createPost } from '../services/api';
import { toast } from 'react-toastify';
import { SiLeagueoflegends, SiValorant, SiRiotgames } from 'react-icons/si';

// 游戏类型枚举
export enum GameType {
  GENERAL = 'GENERAL',
  LEAGUE_OF_LEGENDS = 'LEAGUE_OF_LEGENDS',
  VALORANT = 'VALORANT'
}

export default function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
  const [content, setContent] = useState('');
  const [gameType, setGameType] = useState<GameType>(GameType.GENERAL);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("create post");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      console.log("Creating post with game type:", gameType);
      await createPost({ content, gameType });
      setContent('');
      toast.success('Post created successfully!');
      onPostCreated(); // 刷新帖子列表
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
        
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 font-medium">Game:</label>
            <div className="relative">
              <select
                value={gameType}
                onChange={(e) => setGameType(e.target.value as GameType)}
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