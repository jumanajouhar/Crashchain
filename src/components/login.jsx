import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Ensure the path is correct
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState(''); // For password reset
  const [isResettingPassword, setIsResettingPassword] = useState(false); // Toggle for reset form
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      navigate('/dashboard');
      // Redirect or perform other actions after successful login
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error (e.g., display error message)
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      console.log('Password reset email sent');
      alert('Password reset email sent! Check your inbox.');
      setResetEmail(''); // Clear the reset email input after sending
      setIsResettingPassword(false); // Hide reset form after success
    } catch (error) {
      console.error('Error sending password reset email:', error);
      // Handle error (e.g., display error message)
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
            className="w-full p-3 mb-3 rounded border border-gray-300 bg-white"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white border-none rounded cursor-pointer text-lg"
          >
            Send Reset Email
          </button>
        </form>
        <p
          className="mt-5 cursor-pointer text-blue-500"
          onClick={() => setIsResettingPassword(false)}
        >
          Back to Login
        </p>
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
            className="w-full p-3 mb-3 rounded border border-gray-300 bg-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-3 rounded border border-gray-300 bg-white"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white border-none rounded cursor-pointer text-lg"
          >
            Login
          </button>
        </form>
        <p
          className="mt-5 cursor-pointer text-blue-500"
          onClick={() => setIsResettingPassword(true)}
        >
          Forgot Password?
        </p>
      </>
    )}
  </div>
</div>

  );
};

export default Login;
