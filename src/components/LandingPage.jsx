import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-white">Welcome to Portfolio Tracker</h1>
        <p className="mb-6 text-gray-400 text-lg">Track your stock investments in real-time with live market insights.</p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-md"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

