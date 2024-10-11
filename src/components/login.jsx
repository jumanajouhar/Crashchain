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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'white',
    }}>
      <div style={{
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '400px',
      }}>
        {isResettingPassword ? (
          // Password Reset Form
          <>
            <h2 style={{
              marginBottom: '20px',
              fontSize: '36px',
              color: '#007bff',
              fontWeight: 'bold',
            }}>
              Reset Password
            </h2>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  margin: '10px 0',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                }}
                required
              />
              <button type="submit" style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}>
                Send Reset Email
              </button>
            </form>
            <p style={{ marginTop: '20px', cursor: 'pointer', color: '#007bff' }} onClick={() => setIsResettingPassword(false)}>
              Back to Login
            </p>
          </>
        ) : (
          // Login Form
          <>
            <h2 style={{
              marginBottom: '20px',
              fontSize: '36px',
              color: '#007bff',
              fontWeight: 'bold',
            }}>
              Login
            </h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  margin: '10px 0',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                }}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  margin: '10px 0',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: 'white',
                }}
                required
              />
              <button type="submit" style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}>
                Login
              </button>
            </form>
            <p style={{ marginTop: '20px', cursor: 'pointer', color: '#007bff' }} onClick={() => setIsResettingPassword(true)}>
              Forgot Password?
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
