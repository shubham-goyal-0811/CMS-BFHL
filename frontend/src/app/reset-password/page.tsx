'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '../context/UserContext';

const ResetPasswordPage = () => {
  const { resetPassword } = useUser();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await resetPassword(token, password);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>

      <div className="w-full max-w-sm flex flex-col space-y-4">
        <input
          type="password"
          placeholder="New Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleReset}
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
