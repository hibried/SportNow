import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

const EditAccountModal = ({ isOpen, onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm({ mode: "onChange" });

    const [loading, setLoading] = useState(false);

    const getMyId = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            return response.data.data.id;
        } catch (error) {
            throw new Error(error);
        }
    }

    const onSubmit = async (data) => {
		setLoading(true);

		data.role = localStorage.getItem("role");
		console.log(data);

        const token = localStorage.getItem("accessToken");
        const user_id = await getMyId();

		const headers = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}

		const loading_toast = toast.loading("Updating...");

		try {
			const response = await axios.post(`${BASE_URL}/api/v1/update-user/${user_id}`, data, headers);
			setTimeout(() => {
				toast.dismiss(loading_toast);
				toast.success('Successfully updated');
				setLoading(false);
                onClose();
                window.location.reload();
			}, 2000);
		} catch (error) {
			console.error(error.response.data.message);
			toast.dismiss(loading_toast);
			toast.error(error.response.data.message);
            setLoading(false);
		}
    };

    return (
        <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className="modal-box w-96 rounded-tr-4xl rounded-bl-4xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 btn btn-ghost btn-square btn-sm"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Logo */}
                <figure className="flex justify-center mt-4">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/5961/5961060.png"
                        alt="Sports Logo"
                        className="w-20 h-20"
                    />
                </figure>

                {/* Form */}
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-2xl font-bold text-cyan-500">
                        Edit Account
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        {/* Full Name */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Full Name *</span>
                            </label><br />
                            <input
                                type="text"
                                placeholder="John Doe"
                                className={`input input-bordered ${
                                    errors.name && "input-error"
                                }`}
                                {...register("name", { required: "Full name is required" })}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Phone Number</span>
                            </label><br />
                            <input
                                type="tel"
                                placeholder="081234567890"
                                className={`input input-bordered ${
                                errors.phone_number && "input-error"
                                }`}
                                {...register("phone_number", {
                                    pattern: {
                                        value: /^[0-9]{10,15}$/,
                                        message: "Enter a valid phone number (10–15 digits)",
                                    },
                                })}
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone_number.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Password *</span>
                            </label><br />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className={`input input-bordered ${
                                    errors.password && "input-error"
                                }`}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" },
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Confirm Password *</span>
                            </label><br />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className={`input input-bordered ${
                                    errors.c_password && "input-error"
                                }`}
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

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn btn-warning w-80"
                            disabled={!isValid || loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
            {/* Overlay */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
};

export default EditAccountModal;
