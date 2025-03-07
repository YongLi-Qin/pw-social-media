import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  // TODO: 添加认证状态检查
  const isAuthenticated = true; // 临时设置为 true 以测试路由

  return (
    <GoogleOAuthProvider clientId="162286194936-8r4kpr3pfffo02po1lp791kpt28jrrmf.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
