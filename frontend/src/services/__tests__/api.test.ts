import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getAllPosts, getPostsByGameType, createPost, GameType } from '../api';

// Mock fetch
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetch as any).mockClear();
  });

  describe('getAllPosts', () => {
    it('fetches all posts successfully', async () => {
      const mockPosts = [
        { id: '1', content: 'Test post', gameType: 'VALORANT' }
      ];
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      });

      const result = await getAllPosts();
      
      expect(fetch).toHaveBeenCalledWith('/api/posts');
      expect(result).toEqual(mockPosts);
    });

    it('throws error when fetch fails', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(getAllPosts()).rejects.toThrow();
    });
  });

  describe('getPostsByGameType', () => {
    it('fetches posts by game type successfully', async () => {
      const mockPosts = [
        { id: '1', content: 'Valorant post', gameType: 'VALORANT' }
      ];
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts
      });

      const result = await getPostsByGameType(GameType.VALORANT);
      
      expect(fetch).toHaveBeenCalledWith('/api/posts/game/VALORANT');
      expect(result).toEqual(mockPosts);
    });
  });

  describe('createPost', () => {
    it('creates a post successfully', async () => {
      const newPost = {
        content: 'New post',
        gameType: GameType.VALORANT,
        ranking: 1
      };
      
      const mockResponse = { id: '1', ...newPost };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await createPost(newPost);
      
      expect(fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost)
      });
      expect(result).toEqual(mockResponse);
    });
  });
}); 