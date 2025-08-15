import { useState } from 'react'
import { Toaster } from 'sonner';

import { Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import PaymentConfirmationPage from './pages/PaymentConfirmationPage';
import MyTransactionPage from './pages/MyTransactionPage';

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
        <Route path='/activity' element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path='/activity/:id' element={
          <ProtectedRoute>
            <DetailPage />
          </ProtectedRoute>
        } />
        <Route path='/transaction/:id/confirm' element={
          <ProtectedRoute>
            <PaymentConfirmationPage />
          </ProtectedRoute>
        } />
        <Route path='/my-transaction' element={
          <ProtectedRoute>
            <MyTransactionPage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
