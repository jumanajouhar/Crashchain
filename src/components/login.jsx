import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Ensure the path is correct
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState(''); // Change from username to email
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use Firebase to sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      // Redirect or perform other actions after successful login
    } catch (error) {
      console.error('Error logging in:', error);
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
            type="email" // Change input type to email
            placeholder="Email" // Change placeholder to Email
            value={email} // Bind email state
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
      </div>
    </div>
  );
};

export default Login;
