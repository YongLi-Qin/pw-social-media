// 定义登录响应数据的接口
interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    picture?: string;
    isAdmin?: boolean;  // 新增管理员标识
    // 其他可能的用户字段
  };
}

// 登录成功后
const handleLoginSuccess = (data: LoginResponse) => {
  localStorage.setItem('token', data.token);
  
  // 确保用户信息完整
  const user = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    avatar: data.user.avatar,
    picture: data.user.picture,
    isAdmin: data.user.isAdmin || false,  // 新增管理员标识，默认为 false
    // 其他字段...
  };
  
  console.log('[DEBUG] Storing user in localStorage:', user);
  localStorage.setItem('user', JSON.stringify(user));
}; 