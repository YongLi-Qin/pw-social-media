

interface CommentProps {
  comment: {
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
      avatar: string;
    };
  };
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="flex items-start space-x-3 py-2">
      <img
        src={comment.user.avatar}
        alt="avatar"
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="text-sm font-medium">{comment.user.name}</div>
        <div className="text-gray-700 text-sm">{comment.content}</div>
        <div className="text-gray-400 text-xs">{comment.createdAt}</div>
      </div>
    </div>
  );
}
