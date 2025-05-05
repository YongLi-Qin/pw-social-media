import PostItem from './PostItem';
import type { Post } from '../services/api';



interface PostListProps {
  posts: Post[];
  onPostUpdated: () => void;
  
}

export default function PostList({ posts = [], onPostUpdated }: PostListProps) {


  if (!Array.isArray(posts)) {
    return (
      <div className="text-center py-4 text-gray-600">
        No posts available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onPostUpdated={onPostUpdated}
        />
      ))}
    </div>
  );
}