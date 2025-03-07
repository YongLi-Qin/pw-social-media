import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../services/api';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

interface GoogleLoginButtonProps {
  onSuccess: () => void;
}

interface GoogleUserInfo {
  name: string;
  email: string;
  picture: string;
  sub: string; // Google的用户ID
}

export default function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      // 解码 JWT 令牌以获取用户信息
      const decodedToken = jwtDecode<GoogleUserInfo>(credentialResponse.credential);
      console.log("Google user info:", decodedToken);
      
      // 调用后端 API
      const response = await googleLogin(credentialResponse.credential);
      
      // 存储令牌
      localStorage.setItem('token', response.token);
      
      // 存储用户信息，包括 Google 用户 ID
      localStorage.setItem('user', JSON.stringify({
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
        googleId: decodedToken.sub
      }));
      
      toast.success('Google login successful!');
      onSuccess();
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
    }
  };

  return (
    <div className="mt-4 flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast.error('Google login failed')}
        theme="filled_black"
        shape="rectangular"
        text="signin_with"
        locale="en"
        useOneTap
      />
    </div>
  );
} 