import React, { useState } from 'react';
import { updateAvatar } from '../services/api';
import { toast } from 'react-toastify';

// ImgBB API 密钥
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY'; // 替换为你的 API 密钥

// 添加 onAvatarUpdated 属性
interface AvatarUploadProps {
  onAvatarUpdated?: () => void;
}

export default function AvatarUpload({ onAvatarUpdated }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    
    try {
      // 创建 FormData 对象
      const formData = new FormData();
      formData.append('image', file);
      
      // 上传到 ImgBB
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 获取图片 URL
        const imageUrl = data.data.url;
        
        // 更新用户头像
        await updateAvatar(imageUrl);
        
        // 显示成功消息
        toast.success('Avatar updated successfully');
        
        // 调用回调函数而不是刷新页面
        if (onAvatarUpdated) {
          onAvatarUpdated();
        }
      } else {
        throw new Error(data.error?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
      <div className="mt-1 flex items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
          className="hidden"
          id="avatar-upload"
        />
        <label
          htmlFor="avatar-upload"
          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          {isUploading ? 'Uploading...' : 'Change Avatar'}
        </label>
      </div>
    </div>
  );
} 