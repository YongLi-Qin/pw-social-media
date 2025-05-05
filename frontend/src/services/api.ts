import axios from 'axios';
import { AuthResponse} from '../types/auth';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});




export interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  gameType: GameType;
  user: {
    id: number;
    name: string;
    email: string;
    picture: string;
  };
  gameRanking?: GameRanking; // ✅ 使用完整结构
  commentCount: number;
  recentComments: CommentDto[];
}


export interface CommentDto {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  postId: number;
}

// 添加 GameRanking 接口
export interface GameRanking {
  id: number;
  gameType: string;
  rankingName: string;
  rankingScore: number;
  rankingType: string;
}

// 前端使用的枚举（用于URL和显示）
export enum GameType {
  GENERAL = 'all-games',
  VALORANT = 'valorant',
  LEAGUE_OF_LEGENDS = 'league-of-legends'
}

// 映射到后端期望的格式

export const gameTypeToBackend: Record<GameType, 'GENERAL' | 'VALORANT' | 'LEAGUE_OF_LEGENDS'> = {
  [GameType.GENERAL]: 'GENERAL',
  [GameType.VALORANT]: 'VALORANT',
  [GameType.LEAGUE_OF_LEGENDS]: 'LEAGUE_OF_LEGENDS',
};


// 反向映射，从URL参数到GameType
export const urlToGameType = (urlParam: string): GameType | null => {
  switch (urlParam.toLowerCase()) {
    case 'valorant':
      return GameType.VALORANT;
    case 'league-of-legends':
      return GameType.LEAGUE_OF_LEGENDS;
    case 'all-games':
      return GameType.GENERAL;
    default:
      return null;
  }
};

// 获取特定游戏类型的排名
export const getRankingsByGameType = async (gameType: GameType): Promise<GameRanking[]> => {
  try {
    const backendGameType = gameTypeToBackend[gameType];
    
    if (!backendGameType) {
      console.error(`Invalid game type: ${gameType}`);
      return [];
    }

    const response = await axios.get<GameRanking[]>(`${API_URL}/rankings/game/${backendGameType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rankings by game type:', error);
    return [];
  }
};


// 获取特定游戏类型的帖子
export const getPostsByGameType = async (gameType: GameType): Promise<Post[]> => {
  try {
    const backendGameType = gameTypeToBackend[gameType];
    
    if (!backendGameType) {
      console.error(`Invalid game type: ${gameType}`);
      return [];
    }

    const response = await axios.get<Post[]>(`${API_URL}/posts/game/${backendGameType}`);

    const posts = response.data;
    return posts.map((post) => ({
      ...post,
      user: post.user || {
        id: 0,
        name: 'Unknown User',
        email: 'unknown@example.com',
        picture: ''
      },
      gameRanking: post.gameRanking
        ? {
            id: post.gameRanking.id,
            rankingName: post.gameRanking.rankingName,
            gameType: post.gameRanking.gameType,
            rankingScore: post.gameRanking.rankingScore,
            rankingType: post.gameRanking.rankingType,
          }
        : undefined
    }));
  } catch (error) {
    const err = error as any;
    console.error('Error fetching posts by game type:', err);
    console.error('Error details:', err.response?.data || err.message);
    return [];
  }
};


// 请求拦截器添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  console.log("login request: " + email + password);
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const signup = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup', { email, password, name });
  return response.data;
};


export type BackendGameType = 'GENERAL' | 'VALORANT' | 'LEAGUE_OF_LEGENDS';


// 添加 Post 相关类型
export interface PostRequest {
  content: string;
  imageUrl?: string;
  gameType: BackendGameType; // "GENERAL", "VALORANT", etc.
  rankingId?: number;
}
// 添加创建帖子的 API 方法
export const createPost = async (postData: PostRequest) => {
  console.log('📤 createPost payload:', postData); // 👈 加这一行看发了什么
  const response = await api.post('/posts', postData);
  return response.data;
};



export const getUserPosts = async (): Promise<Post[]> => {
  const token = localStorage.getItem('token');
  const res = await axios.get<Post[]>('http://localhost:8000/api/posts/user', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// 添加获取所有帖子的方法
export const getAllPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>('/posts');
  return response.data.map((post) => ({
    ...post,
    user: post.user || {
      id: 0,
      name: 'Unknown User',
      email: 'unknown@example.com',
      picture: ''
    },
    gameRanking: post.gameRanking
      ? {
          id: post.gameRanking.id,
          rankingName: post.gameRanking.rankingName,
          gameType: post.gameRanking.gameType,
          rankingScore: post.gameRanking.rankingScore,
          rankingType: post.gameRanking.rankingType,
        }
      : undefined
  }));
};


export const updatePost = async (postId: number, content: string) => {
  const response = await api.put(`/posts/${postId}`, { content });
  return response.data;
};

export const deletePost = async (postId: number) => {
  await api.delete(`/posts/${postId}`);
};

export async function googleLogin(token: string) {
  return fetch('http://localhost:8000/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ credential: token }),
  }).then((res) => res.json());
}

// 评论相关API
export const createComment = async (content: string, postId: number): Promise<any> => {
  const token = localStorage.getItem('token');
  console.log("Creating comment with token:", token ? "present" : "missing");
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  try {
    const response = await axios.post(
      `${API_URL}/comments`,
      { content, postId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error details:", error);
    throw error;
  }
};

export const getCommentsByPostId = async (postId: number): Promise<any> => {
  console.log(`Calling API: ${API_URL}/comments/post/${postId}`);
  
  try {
    // 不使用认证令牌，简化请求
    const response = await axios.get(`${API_URL}/comments/post/${postId}`);
    console.log("Response:", response);
    return response.data || [];
  } catch (error) {
    console.error("Error details:", error);
    // 返回空数组而不是抛出错误，避免UI崩溃
    return [];
  }
};

export const updateComment = async (commentId: number, content: string, postId: number): Promise<any> => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/comments/${commentId}`,
    { content, postId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const deleteComment = async (commentId: number): Promise<any> => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(
    `${API_URL}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export default api; 