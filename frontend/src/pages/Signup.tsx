import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const data = await signup(email, password, name);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        name: data.name,
        email: data.email
      }));
      
      navigate('/home');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Error creating account. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-zinc-800 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Gaming Social</h1>
          <p className="text-zinc-400 mt-2">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="text-center text-sm mt-6">
          <Link
            to="/login"
            className="font-medium text-indigo-500 hover:text-indigo-400"
          >
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
} 