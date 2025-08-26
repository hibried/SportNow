import { useState } from 'react'
import { Toaster, toast } from 'sonner';

import { Routes, Route, useNavigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';

import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import PaymentConfirmationPage from './pages/PaymentConfirmationPage';
import MyTransactionPage from './pages/MyTransactionPage';

import { Dashboard } from './components/admin/Dashboard';
import { Categories } from './components/admin/Categories';
import { SportActivities } from './components/admin/SportActivities';
import { SportActivitiesForm } from './components/admin/SportActivitiesForm';
import { Transactions } from './components/admin/Transactions';

import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';

import axios from 'axios';

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

function App() {
  const navigate = useNavigate();

  async function Logout(){
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(`${BASE_URL}/api/v1/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      console.log(response);
      
      if(response.status === 200){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        
        const loading_toast = toast.loading("Logging out...");
        setTimeout(() => {
          navigate("/");
          toast.dismiss(loading_toast);
          toast.success('Successfully logged out');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }    
  }

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
          <GuestRoute>
            <LandingPage />
          </GuestRoute>
        } />
        {/* user only */}
        <Route path='/activity' element={
          <ProtectedRoute Logout={ Logout } children={ <HomePage /> } allowedRoles={ ["user"] } />
        } />
        <Route path='/activity/:id' element={
          <ProtectedRoute Logout={ Logout } children={ <DetailPage /> } allowedRoles={ ["user"] } />
        } />
        <Route path='/transaction/:id/confirm' element={
          <ProtectedRoute Logout={ Logout } children={ <PaymentConfirmationPage /> } allowedRoles={ ["user"] } />
        } />
        <Route path='/my-transaction' element={
          <ProtectedRoute Logout={ Logout } children={ <MyTransactionPage /> } allowedRoles={ ["user"] } />
        } />

        {/* admin only */}
        <Route path='/dashboard' element={
          <ProtectedRoute Logout={ Logout } children={ Dashboard } allowedRoles={ ["admin"] } />
        } />
        <Route path='/categories' element={
          <ProtectedRoute Logout={ Logout } children={ Categories } allowedRoles={ ["admin"] } />
        } />
        <Route path='/sport_activities' element={
          <ProtectedRoute Logout={ Logout } children={ SportActivities } allowedRoles={ ["admin"] } />
        } />
        <Route path='/sport_activities/add' element={
          <ProtectedRoute Logout={ Logout } children={ SportActivitiesForm } allowedRoles={ ["admin"] } />
        } />
        <Route path='/sport_activities/edit/:id' element={
          <ProtectedRoute Logout={ Logout } children={ SportActivitiesForm } allowedRoles={ ["admin"] } />
        } />
        <Route path='/transactions' element={
          <ProtectedRoute Logout={ Logout } children={ Transactions } allowedRoles={ ["admin"] } />
        } />
      </Routes>
    </>
  )
}

export default App
