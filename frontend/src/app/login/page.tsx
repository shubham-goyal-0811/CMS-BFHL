'use client';

import { useState } from 'react';
import { useUser } from '../context/UserContext';

const LoginPage = () => {
  const { login, forgotPassword } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(forgotEmail);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <div className="w-full max-w-sm flex flex-col space-y-4">
        {/* Login */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Forgot Password */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Forgot Password?</h2>
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 rounded w-full"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <button
            onClick={handleForgotPassword}
            className="bg-gray-600 text-white p-2 rounded w-full mt-2 hover:bg-gray-700 transition"
          >
            Send Reset Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
