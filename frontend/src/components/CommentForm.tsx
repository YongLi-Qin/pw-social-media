import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CommentFormProps {
  postId: number;
  onCommentAdded: (comment: any) => void;
}

// 定义评论数据的接口
interface CommentData {
  id: number;
  content: string;
  createdAt: string;
  postId: number;
  userId: number;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 获取当前用户信息
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post<CommentData>(
        `http://localhost:8000/api/comments`,   // ✅ 正确路径
      { content, postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 创建新评论对象，不使用展开运算符
      const newComment = {
        id: response.data.id,
        content: response.data.content,
        createdAt: response.data.createdAt,
        user: {
          id: currentUser?.id,
          name: currentUser?.name,
          avatar: currentUser?.avatar
        }
      };
      
      onCommentAdded(newComment);
      setContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
          {currentUser?.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Adding Comment..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Comment'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm; 