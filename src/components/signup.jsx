import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Ensure the path is correct
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    try {
      // Create a new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign Up successful');
      navigate('/dashboard');
      // Redirect or perform other actions after successful sign-up
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Error signing up: ' + error.message); // Display error message
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
        <h2 style={{ 
          marginBottom: '20px',
          fontSize: '36px',
          color: '#007bff',
          fontWeight: 'bold',
        }}>
          Sign Up
        </h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
