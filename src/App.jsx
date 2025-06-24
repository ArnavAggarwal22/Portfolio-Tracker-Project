// src/App.jsx
import LiveTrends from './components/LiveTrends';


import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <Routes>

      <Route path="/app/trends" element={<LiveTrends />} />




      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<Dashboard />} />
    </Routes>
  );
}
