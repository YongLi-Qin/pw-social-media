// 登录成功后
const handleLoginSuccess = (data) => {
  localStorage.setItem('token', data.token);
  
  // 确保用户信息完整
  const user = {
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    // 其他字段...
  };
  
  console.log('[DEBUG] Storing user in localStorage:', user);
  localStorage.setItem('user', JSON.stringify(user));
}; 