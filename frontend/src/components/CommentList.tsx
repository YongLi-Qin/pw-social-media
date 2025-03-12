import { useState, useEffect } from 'react';
import { getCommentsByPostId } from '../services/api';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { Comment } from '../types/comment';

interface CommentListProps {
  postId: number;
  isExpanded: boolean;
}

export default function CommentList({ postId, isExpanded }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadComments = async () => {
    if (!isExpanded) return;
    
    setIsLoading(true);
    try {
      const data = await getCommentsByPostId(postId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isExpanded) {
      loadComments();
    }
  }, [postId, isExpanded]);
  
  if (!isExpanded) return null;
  
  return (
    <div className="mt-4 bg-gray-50 p-3 rounded-md">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
      
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onCommentUpdated={loadComments} 
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 py-2">No comments yet. Be the first to comment!</p>
      )}
      
      <CommentForm postId={postId} onCommentAdded={loadComments} />
    </div>
  );
} 