import { useState, useEffect } from "react";
import {
	MapPin,
	Calendar,
	Clock,
	Users,
	User,
	Ticket,
	Loader2,
	CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

export default function ActivityDetail({ activity }) {
	const [bearerToken, setBearerToken] = useState();

	const [isJoining, setIsJoining] = useState(false);
	const [isJoined, setIsJoined] = useState(false);
	const [participants, setParticipants] = useState(activity.participants || []);
	const [paymentMethods, setPaymentMethods] = useState([]);
	const [selectedPayment, setSelectedPayment] = useState("");
	const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

	const fullAddress = `${activity.address}, ${activity.city?.city_name_full}, ${activity.city?.province?.province_name}`;
	const mapQuery = encodeURIComponent(fullAddress);

	const isFull = participants.length >= activity.slot;
	const isPastEvent = new Date(activity.activity_date) < new Date();

	const canJoin = !isFull && !isPastEvent && !isJoining && !isJoined;

	const fetchMethods = async () => {
		try {
			const response = await axios.get(`${BASE_URL}/api/v1/payment-methods`);
			console.log(response.data.result);
			setPaymentMethods(response.data.result || []);
		} catch (err) {
			console.error("Failed to fetch payment methods:", err);
		}
	};

	const hasUserJoined = async() => {
		try {
			const response = await axios.get(`${BASE_URL}/api/v1/me`, {
				headers: {
					Authorization: `Bearer ${bearerToken}`,
					Accept: 'application/json',
				},
			});
			// console.log(response.data.data.email);
			const emails = participants.map((p) => {
				return p.user.email;
			})
			console.log(emails);
			if(emails.includes(response.data.data.email)){
				setIsJoined(true);
			}
		} catch (error) {
			console.error(error);
		}
	}

	const handleJoin = async () => {
		if (!canJoin) return;
		setIsJoining(true);
		try {
			await onJoin?.(activity.id); // Call parent join function

			// Instantly add current user to participants list
			setParticipants((prev) => [
			...prev,
			{
				id: Date.now(), // temporary ID
				user: {
				name: currentUser?.name,
				email: currentUser?.email,
				},
			},
			]);

			// Show joined success state
			// setIsJoined(true);
			// setTimeout(() => {
			//   setIsJoined(false);
			// }, 2000);
		} catch (error) {
			console.error("Join failed:", error);
		} finally {
			setIsJoining(false);
		}
	};

  	const navigate = useNavigate();

	const openCheckoutModal = () => {
		document.getElementById("checkout_modal").showModal();
	};

	const handleCheckout = async () => {
		if (!selectedPayment) return alert("Please select a payment method");
		setIsCheckoutLoading(true);
		try {
			const response = await axios.post(`${BASE_URL}/api/v1/transaction/create`, 
				{
					sport_activity_id: activity.id,
					payment_method_id: selectedPayment,
				},
				{
					headers: {
						Authorization: `Bearer ${bearerToken}`,
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			);
			if (!response.data.error) {
				// setParticipants((prev) => [
				//   ...prev,
				//   {
				//     id: Date.now(),
				//     user: {
				//       name: currentUser?.name,
				//       email: currentUser?.email,
				//     },
				//   },
				// ]);
				navigate(`/my-transaction/${response.data.result.id}`);
				document.getElementById("checkout_modal").close();
			} else {
				alert("Checkout failed: " + (response.data.message || "Unknown error"));
			}
			console.log("Checkout success")
		} catch (err) {
			console.error("Checkout failed:", err);
		} finally {
			setIsCheckoutLoading(false);
		}
	};

	useEffect(() => {
		fetchMethods();
		setBearerToken(localStorage.getItem("accessToken"));
	}, [])

	useEffect(() => {
		if(bearerToken){
			hasUserJoined();
		}
	}, [bearerToken])

  	return (
		<>
			<div className="bg-base-200 min-h-screen font-sans">
				{/* Hero Section */}
				<div
					className="relative h-64 md:h-80 bg-cover bg-center"
					style={{
					backgroundImage: "url('/images/sports_bg_bw.png')",
					backgroundPosition: "center",
					}}
				>
					{/* Back to Home Button */}
					<button
						onClick={() => navigate(-1)}
						className="absolute z-10 top-3 left-3 md:top-4 md:left-4 btn btn-xs sm:btn-sm md:btn-primary rounded-full flex items-center gap-1 shadow-md"
					>
						← Home
					</button>

					<div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-black/90 flex items-end p-4 md:p-6">
						<div>
							<span className="inline-block bg-secondary text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold mb-1 md:mb-2">
								{isFull ? "FULL" : isPastEvent ? "ENDED" : "UPCOMING"}
							</span>
							<h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-wide uppercase drop-shadow-lg leading-snug">
								{activity.title}
							</h1>
							<p className="text-gray-200 mt-1 text-xs md:text-sm tracking-wide">
								{activity.sport_category?.name} • {activity.city?.city_name_full}
							</p>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
					{/* Price & Slots */}
					<div className="bg-base-100 p-4 sm:p-6 rounded-2xl shadow-lg border-l-4 sm:border-l-8 border-primary flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div className="flex items-center space-x-3">
							<div className="bg-primary/10 p-2 sm:p-3 rounded-full">
								<Ticket className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
							</div>
							<div>
								<p className="text-lg font-bold">
									IDR{activity.price.toLocaleString()}
								</p>
								{activity.price_discount && (
									<p className="text-xs sm:text-sm text-success font-semibold">
										Save Rp {activity.price_discount.toLocaleString()}
									</p>
								)}
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Users className="text-secondary w-5 h-5 sm:w-6 sm:h-6" />
							<p className="font-medium text-sm sm:text-base">
								{participants.length} / {activity.slot}{" "}
								<span className="hidden sm:inline">slots</span>
							</p>
						</div>
					</div>

					{/* Date & Time */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="bg-base-100 p-4 rounded-xl shadow border-t-4 border-primary flex items-center space-x-3">
							<Calendar className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
							<div>
								<p className="font-bold text-xs sm:text-sm">DATE</p>
								<p className="text-sm sm:text-base">{activity.activity_date}</p>
							</div>
						</div>
						<div className="bg-base-100 p-4 rounded-xl shadow border-t-4 border-secondary flex items-center space-x-3">
							<Clock className="text-secondary w-5 h-5 sm:w-6 sm:h-6" />
							<div>
								<p className="font-bold text-xs sm:text-sm">TIME</p>
								<p className="text-sm sm:text-base">
									{activity.start_time} - {activity.end_time}
								</p>
							</div>
						</div>
					</div>

					{/* Address */}
					<div className="bg-base-100 p-4 sm:p-6 rounded-xl shadow border-t-4 border-primary flex flex-col space-y-3">
						<div className="flex items-center space-x-3">
							<MapPin className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
							<div>
								<p className="font-bold uppercase text-xs sm:text-sm tracking-wide">
									Address
								</p>
								<p className="text-sm sm:text-base">{fullAddress}</p>
							</div>
						</div>
						<iframe
							title="Activity Location"
							src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
							className="w-full h-48 sm:h-64 rounded-xl border-0"
							loading="lazy"
						></iframe>
						<a
							href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline text-xs sm:text-sm font-semibold"
						>
							View on Google Maps
						</a>
					</div>

					{/* Organizer */}
					<div className="bg-base-100 p-4 rounded-xl shadow border-t-4 border-secondary">
						<div className="flex items-center justify-between mb-3 sm:mb-4">
							<h2 className="font-bold flex items-center gap-2 text-sm sm:text-base">
								<User className="text-secondary w-5 h-5 sm:w-6 sm:h-6" />
								ORGANIZER
							</h2>
						</div>
						<div>
							<p className="text-base sm:text-lg font-semibold">
								{activity.organizer?.name}
							</p>
							<p className="text-xs sm:text-sm text-gray-500">
								{activity.organizer?.email}
							</p>
						</div>
					</div>

					{/* Participants */}
					<div className="bg-base-100 p-4 sm:p-6 rounded-xl shadow border-t-4 border-primary">
						<div className="flex items-center justify-between mb-3 sm:mb-4">
							<h2 className="font-bold flex items-center gap-2 text-sm sm:text-base">
								<Users className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
								PARTICIPANTS
							</h2>
						</div>
						{participants.length > 0 ? (
							<ul className="divide-y divide-base-200">
								{participants.map((p, index) => (
									<li
										key={p.id}
										className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0"
									>
										<span className="font-medium text-sm sm:text-base">
											{index + 1}. {p.user?.name}
										</span>
										<span className="text-xs sm:text-sm text-gray-500">
											{p.user?.email}
										</span>
									</li>
								))}
							</ul>
						) : (
							<div className="text-center py-6">
								<p className="text-gray-500 italic text-sm sm:text-base">
									No participants yet
								</p>
							</div>
						)}
					</div>

					{/* Action Button */}
					<div className="flex justify-end">
					<button
						className={`btn btn-sm sm:btn-md md:btn-lg rounded-full flex items-center gap-2 transition-all ${
							isJoined ? "!bg-green-600 text-white" : "btn-primary"
						}`}
						disabled={!canJoin}
						onClick={() => {
							openCheckoutModal();
							setIsJoining(true);
						}}
					>
						{isJoining && <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />}
						{isJoined && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
						{isFull
						? "Full"
						: isPastEvent
						? "Event Ended"
						: isJoined
						? "Joined!"
						: isJoining
						? "Joining..."
						: "Join Activity"}
					</button>
					</div>
				</div>
								
				{/* Checkout Modal */}
				<dialog id="checkout_modal" className="modal">
					{bearerToken ? (
						<div className="modal-box w-full max-w-md sm:max-w-lg">
							<h3 className="font-bold text-base sm:text-lg">Checkout</h3>
							<p className="py-2 text-sm sm:text-base">{activity.title}</p>
							<p className="text-xs sm:text-sm text-gray-500">
								{activity.activity_date} • Rp {activity.price.toLocaleString()}
							</p>

							<div className="mt-4">
								<label className="block font-semibold mb-1 text-sm sm:text-base">
									Payment Method
								</label>
								<select
									className="select select-bordered w-full"
									value={selectedPayment}
									onChange={(e) => setSelectedPayment(e.target.value)}
								>
									<option value="">-- Select Payment Method --</option>
									{paymentMethods.map((pm) => (
									<option key={pm.id} value={pm.id}>
										{pm.name}
									</option>
									))}
								</select>
							</div>

							<div className="modal-action">
								<form method="dialog">
									<button
										onClick={() => setIsJoining(false)}
										className="btn btn-sm sm:btn-md"
										disabled={isCheckoutLoading}
									>
										Cancel
									</button>
								</form>
								<button
									className={`btn btn-primary btn-sm sm:btn-md ${
									isCheckoutLoading ? "loading" : ""
									}`}
									onClick={handleCheckout}
								>
									Confirm & Pay
								</button>
							</div>
						</div>
					) : (
						<div className="modal-box text-center w-full max-w-xs sm:max-w-sm pt-6 sm:pt-10 px-5 sm:px-7">
							<h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">
								Join this activity on SportNow
							</h3>
							<p className="text-xs sm:text-sm">See more from Indonesia right now.</p>
							<div className="modal-action flex-col gap-2 sm:gap-3">
								<button
									className="btn btn-primary btn-sm sm:btn-md"
									onClick={() => navigate("/login")}
								>
									Login now
								</button>
								<form method="dialog">
									<button
										onClick={() => setIsJoining(false)}
										className="btn btn-ghost w-full btn-sm sm:btn-md"
									>
										Not now
									</button>
								</form>
							</div>
						</div>
					)}
				</dialog>
			</div>
		</>
  	);
}
