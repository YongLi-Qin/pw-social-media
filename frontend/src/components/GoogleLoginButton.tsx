import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../services/api';
import { toast } from 'react-toastify';

interface GoogleLoginButtonProps {
  onSuccess: () => void;
}

export default function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await googleLogin(credentialResponse.credential);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      onSuccess();
    } catch (error) {
      toast.error('Google login failed');
      console.error('Google login error:', error);
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
        flow="implicit"
      />
    </div>
  );
} 