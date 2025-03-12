export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  postId: number;
}

export interface CommentRequest {
  content: string;
  postId: number;
} 