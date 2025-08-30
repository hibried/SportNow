import { Toaster, toast } from 'sonner';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Navbar from "./components/Navbar";
import LoginPage from './pages/guest/LoginPage'
import RegisterPage from './pages/guest/RegisterPage';
import LandingPage from './pages/public/LandingPage';

import DetailPage from './pages/public/DetailPage';
import ActivitiesPage from './pages/public/ActivitiesPage';
import PaymentConfirmationPage from './pages/user/PaymentConfirmationPage';
import MyTransactionPage from './pages/user/MyTransactionPage';

import { Dashboard } from './components/admin/Dashboard';
import { Categories } from './components/admin/Categories';
import { SportActivities } from './components/admin/SportActivities';
import { SportActivitiesForm } from './components/admin/SportActivitiesForm';
import { Transactions } from './components/admin/Transactions';
import { Invoice } from './components/admin/Invoice';

import RouteGuard from './components/routing/RouteGuard';
// import GuestRoute from './components/routing/GuestRoute';
// import PublicRoute from './components/routing/PublicRoute';
// import ProtectedRoute from './components/routing/ProtectedRoute';

function App() {

	return (
		<>
			<Toaster />
			<Routes>
				{/* GUEST ONLY */}
				<Route path='/login' element={
					<RouteGuard type="guest">
						<LoginPage />
					</RouteGuard>
				} />
				<Route path='/register' element={
					<RouteGuard type="guest">
						<RegisterPage />
					</RouteGuard>
				} />

				{/* PUBLIC (USER & ADMIN) */}
				<Route path='/' element={
					<RouteGuard type="public">
						<LandingPage />
					</RouteGuard>
				} />

				<Route path='/activities' element={
					<RouteGuard type="public">
						<ActivitiesPage />
					</RouteGuard>
				} />
				<Route path='/activities/:id' element={
					<RouteGuard type="public">
						<DetailPage />
					</RouteGuard>
				} />

				{/* USER ONLY */}
				<Route path='/my-transaction/:id' element={
					<RouteGuard type="protected" allowedRoles={["user"]}>
						<Invoice />
					</RouteGuard>
				} />
				<Route path='/my-transaction' element={
					<RouteGuard type="protected" allowedRoles={["user"]}>
						<MyTransactionPage />
					</RouteGuard>
				} />

				{/* ADMIN ONLY */}
				<Route path='/dashboard' element={
					<RouteGuard type="protected" allowedRoles={["admin"]}>
						{ Dashboard }
					</RouteGuard>
				} />
				<Route path='/categories' element={
					<RouteGuard type="protected" allowedRoles={["admin"]}>
						{ Categories }
					</RouteGuard>
				} />
				<Route path='/sport_activities' element={
					<RouteGuard type="protected" allowedRoles={["admin"]}>
						{ SportActivities}
					</RouteGuard>
				} />
				<Route path='/sport_activities/add' element={
					<RouteGuard type="protected" allowedRoles={["admin"]}>
						{ SportActivitiesForm }
					</RouteGuard>
				} />
				<Route path='/sport_activities/edit/:id' element={
					<RouteGuard type="protected" allowedRoles={["admin"]}>
						{ SportActivitiesForm }
					</RouteGuard>
				} />
				<Route path='/transactions' element={
					<RouteGuard type="protected" allowedRoles={["admin"]}>
						{ Transactions }
					</RouteGuard>
				} />
				<Route path='/transactions/invoice/:id' element={
					<RouteGuard type="protected" allowedRoles={["admin"]}>
						{ Invoice }
					</RouteGuard>
				} />
			</Routes>
		</>
	)
}

export default App
