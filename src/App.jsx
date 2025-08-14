import { useState } from 'react'
import { Toaster } from 'sonner';

import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/login' element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        } />
        <Route path='/register' element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        } />
        <Route path='/' element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
