import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { updateComment, deleteComment } from '../services/api';
import { toast } from 'react-toastify';
import { Comment } from '../types/comment';

interface CommentItemProps {
  comment: Comment;
  onCommentUpdated: () => void;
}

export default function CommentItem({ comment, onCommentUpdated }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  
  // 获取当前用户ID
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isOwner = currentUser && currentUser.email === comment.user.email;
  
  const handleSave = async () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      await updateComment(comment.id, editContent, comment.postId);
      setIsEditing(false);
      onCommentUpdated();
      toast.success('Comment updated');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(comment.id);
        onCommentUpdated();
        toast.success('Comment deleted');
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
      }
    }
  };
  
  return (
    <div className="border-t border-gray-200 pt-3 pb-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <span className="font-medium text-gray-800">{comment.user.name}</span>
          <span className="text-xs text-gray-500 ml-2">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        {isOwner && (
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FaTrash size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={14} />
                </button>
                <button
                  onClick={handleSave}
                  className="text-gray-500 hover:text-green-500"
                >
                  <FaSave size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            rows={2}
          />
        </div>
      ) : (
        <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
      )}
    </div>
  );
} 