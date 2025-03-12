import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Comment } from './Comment';
import { CommentForm } from './CommentForm';

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
      };
    }>;
  };
}

export const Post: React.FC<PostProps> = ({ post }) => {
  const [showAllComments, setShowAllComments] = useState(false);
  
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
        {post.recentComments && post.recentComments.length > 0 && (
          <div className="recent-comments">
            {post.recentComments.map(comment => (
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
        <CommentForm postId={post.id} />
      </div>
    </div>
  );
}; 