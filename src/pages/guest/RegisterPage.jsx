import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from 'sonner';
import axios from "axios";

function RegisterPage() {
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm({ mode: "onChange" });

	const navigate = useNavigate();

	const onSubmit = async (data) => {
		// console.log("Register Data:", data);
		// alert(`Welcome, ${data.fullName}!`);

		setLoading(true);

		data.role = "user";
		console.log(data);

		const headers = {
			headers: {
				'Accept': 'application/json'
			}
		}

		const loading_toast = toast.loading("Registering...");

		try {
			const response = await axios.post('https://sport-reservation-api-bootcamp.do.dibimbing.id/api/v1/register', data, headers);
			setTimeout(() => {
				navigate("/login");
				toast.dismiss(loading_toast);
				toast.success('Successfully registered');
				setLoading(false);
			}, 2000);
		} catch (error) {
			console.error(error.response.data.message);
			toast.dismiss(loading_toast);
			toast.error(error.response.data.message);
		}
	};

	return (
		<div 
			className="min-h-screen flex items-center justify-center bg-cover bg-center sm:p-8 relative"
			style={{
				backgroundImage:
					"url('https://wallpaperbat.com/img/348671-soccer-players-wallpaper.jpg')",
				}}
		>
			<div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-red-500 opacity-75" />
			<div className="card w-full sm:w-96 min-h-screen sm:min-h-auto justify-center bg-base-100 shadow-xl rounded-none sm:rounded-tr-4xl sm:rounded-bl-4xl">
				<div className="card-actions justify-center self-center relative w-96 sm:w-full">
					<button onClick={() => navigate("/")} className="absolute top-5 right-6 btn btn-ghost btn-square btn-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
						</svg>
					</button>
					<figure className="px-10 pt-10">
						<img
							src="https://cdn-icons-png.flaticon.com/512/861/861512.png"
							alt="Sports Logo"
							className="w-20 h-20"
						/>
					</figure>
				</div>
				<div className="card-body max-h-max items-center text-center">
					<h2 className="card-title text-2xl font-bold text-yellow-600">Register</h2>
					<form onSubmit={handleSubmit(onSubmit)} className="w-full">
						<div className="form-control mb-4">
							<label className="label">
								<span className="label-text">Full Name *</span>
							</label><br />
							<input
								type="text"
								placeholder="John Doe"
								className={`input input-bordered ${errors.fullName && "input-error"}`}
								{...register("name", { required: "Full name is required" })}
							/>
							{errors.fullName && (
								<p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
							)}
						</div>
						<div className="form-control mb-4">
							<label className="label">
								<span className="label-text">Email *</span>
							</label><br />
							<input
								type="email"
								placeholder="email@example.com"
								className={`input input-bordered ${errors.email && "input-error"}`}
								{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // basic email regex
									message: "Please enter a valid email address"
								}
								})}
							/>
							{errors.email && (
								<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
							)}
						</div>
						<div className="form-control mb-4">
							<label className="label">
								<span className="label-text">Phone Number</span>
							</label><br />
							<input
								type="tel"
								placeholder="081234567890"
								className={`input input-bordered ${errors.phone && "input-error"}`}
								{...register("phone_number", {
								pattern: {
									value: /^[0-9]{10,15}$/,
									message: "Enter a valid phone number (10–15 digits)",
								},
								})}
							/>
							{errors.phone && (
								<p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
							)}
						</div>
						<div className="form-control mb-4">
							<label className="label">
								<span className="label-text">Password *</span>
							</label><br />
							<input
								type="password"
								placeholder="••••••••"
								className={`input input-bordered ${errors.password && "input-error"}`}
								{...register("password", {
								required: "Password is required",
								minLength: { value: 6, message: "Minimum 6 characters" },
								})}
							/>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
							)}
						</div>
						<div className="form-control mb-4">
							<label className="label">
								<span className="label-text">Confirm Password *</span>
							</label><br />
							<input
								type="password"
								placeholder="••••••••"
								className={`input input-bordered ${errors.c_password && "input-error"}`}
								{...register("c_password", {
								validate: (value) =>
									value === watch("password") || "Passwords do not match",
								})}
							/>
							{errors.c_password && (
								<p className="text-red-500 text-sm mt-1">
									{errors.c_password.message}
								</p>
							)}
						</div>
						<button
							type="submit"
							className="btn btn-warning w-80"
							disabled={!isValid || loading}
						>
							{loading ? "Registering..." : "Register"}
						</button>
					</form>
					<p className="mt-4 text-sm">
						Already have an account?{" "}
						<a href="/login" className="text-red-600 font-bold">
							Login
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage