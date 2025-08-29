import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { useState } from "react";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

function LoginPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // console.log("Login Data:", data);
    // alert(`Welcome back, ${data.email}!`);

    setLoading(true);

    const loading_toast = toast.loading("Logging in...");

    try {
        const loginResponse = await axios.post(`${BASE_URL}/api/v1/login`, data, {
          headers: {
            Accept: 'application/json'
          }
        });
        const token = loginResponse.data.data.token;

        const roleResponse = await axios.get(`${BASE_URL}/api/v1/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const role = roleResponse.data.data.role;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("role", role);

        setTimeout(() => {
            navigate(role === "user" ? "/" : "/dashboard");
            console.log(loginResponse);
            toast.dismiss(loading_toast);
            toast.success('Successfully logged in');
            setLoading(false);
        }, 2000);
    } catch (error) {
        console.error(error.response.data.message);
        toast.dismiss(loading_toast);
        toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure className="px-10 pt-10">
          <img
            src="/images/tennis.png"
            alt="Sports Logo"
            className="w-20 h-20"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl font-bold text-green-600">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
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
                <span className="label-text">Password *</span>
              </label>
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
            <button
              type="submit"
              className="btn btn-success w-full"
              disabled={!isValid || loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 font-bold">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
