import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import CreatePost from './CreatePost';

interface CreatePostButtonProps {
  onPostCreated: () => void;
}

export default function CreatePostButton({ onPostCreated }: CreatePostButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 固定在右下角的添加按钮 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
        title="Create new post"
      >
        <FaPlus className="text-xl" />
      </button>

      {/* 创建帖子的模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create Post</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CreatePost
              onPostCreated={() => {
                onPostCreated();
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
} 