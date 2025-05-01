import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiRiotgames } from 'react-icons/si';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 根据您的后端API调整URL
      const response = await axios.post('http://localhost:8000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Signup response:', response.data);
      
      // 如果注册成功，可以直接使用返回的token登录用户
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.avatar
        }));
        
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        // 如果后端没有直接返回token，则引导用户去登录
        toast.success('Account created successfully! Please log in.');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <SiRiotgames className="text-red-500 text-5xl" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-500' : 'border-zinc-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-zinc-700 text-white`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-zinc-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-zinc-700 text-white`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-zinc-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-zinc-700 text-white`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-zinc-600'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-zinc-700 text-white`}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-zinc-600 rounded-md shadow-sm text-sm font-medium text-white bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  // 这里可以添加Google登录逻辑
                  toast.info('Google login will be implemented soon');
                }}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                    fill="#ffffff"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 