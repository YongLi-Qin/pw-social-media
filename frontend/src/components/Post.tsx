import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import Comment from './Comment';


interface PostProps {
  post: {
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
    };
    commentCount: number;
    recentComments: Array<{
      id: number;
      content: string;
      createdAt: string;
      user: {
        id: number;
        name: string;
        avatar: string;
      };
    }>;
  };
}

// 在 PostProps 接口下添加评论类型定义
interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.recentComments || []);
  
  // 添加评论后的处理函数
  const handleCommentAdded = (newComment: Comment) => {
    // 更新本地评论列表
    setComments([...comments, newComment]);
    // 更新评论计数
    post.commentCount = (post.commentCount || 0) + 1;
    post.recentComments = comments;
  };
  
  return (
    <div className="post">
      <div className="post-header">
        <h3>{post.user.name}</h3>
        <span>{post.createdAt}</span>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
      
      {/* 评论区 */}
      <div className="post-comments">
        <div className="comment-count">
          {post.commentCount} 条评论
        </div>
        
        {/* 显示最近的评论 */}
        {comments && comments.length > 0 && (
          <div className="recent-comments">
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        )}
        
        {/* 如果评论数大于3，显示"查看全部评论"按钮 */}
        {post.commentCount > 3 && (
          <button 
            className="view-all-comments"
            onClick={() => setShowAllComments(!showAllComments)}
          >
            {showAllComments ? '收起评论' : '查看全部评论'}
          </button>
        )}
        
        {/* 当点击"查看全部评论"时，加载所有评论 */}
        {showAllComments && (
          <Link to={`/post/${post.id}/comments`}>查看全部 {post.commentCount} 条评论</Link>
        )}
        
        {/* 评论表单 */}
        <CommentForm 
          postId={post.id} 
          onCommentAdded={handleCommentAdded} 
        />
      </div>
    </div>
  );
}; 