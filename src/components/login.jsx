import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      console.log('Password reset email sent');
      alert('Password reset email sent! Check your inbox.');
      setResetEmail('');
      setIsResettingPassword(false);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="p-10 rounded-lg shadow-lg text-center w-96">
        {isResettingPassword ? (
          // Password Reset Form
          <>
            <h2 className="mb-5 text-4xl text-blue-500 font-bold">Reset Password</h2>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full p-3 mb-3 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Send Reset Email
              </button>
            </form>
            <div className="mt-5 space-y-3">
              <p
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
                onClick={() => setIsResettingPassword(false)}
              >
                Back to Login
              </p>
            </div>
          </>
        ) : (
          // Login Form
          <>
            <h2 className="mb-5 text-4xl text-blue-500 font-bold">Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-3 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-3 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
              >
                Login
              </button>
            </form>
            <div className="mt-5 space-y-3">
              <p
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
                onClick={() => setIsResettingPassword(true)}
              >
                Forgot Password?
              </p>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <span
                  className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;