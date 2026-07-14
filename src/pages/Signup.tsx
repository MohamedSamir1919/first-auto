import axios from 'axios';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  telephone: string; // Added telephone field
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  // Watch the password field to validate the confirmation field
  const password = watch("password");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    setServerError(null);
    try {
      // We don't want to send confirmPassword to the server
      const { confirmPassword, ...signupData } = data;

      const res = await axios.post(`${import.meta.env.VITE_SERVER}/auth`, signupData, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });

      if (res.status === 200) {
        Cookies.set("token", res.data);
        navigate("/shopping");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      // Handle the "You already joined" 302 status or other errors
      if (err.response?.status === 302) {
        setServerError("This email is already registered. Please login.");
      } else {
        setServerError(err.response?.data || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex min-h-[80vh] justify-center items-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg shadow-2xl w-full max-w-[350px] flex flex-col items-center p-6 bg-white border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>


        <div className="w-full flex flex-col mb-4">
          <input
            className="bg-gray-100 p-2 rounded outline-none border focus:border-gray-400 transition-all"
            placeholder="email@example.com"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: "Please enter a valid email address"
              }
            })}
          />
          {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
        </div>
        <div className="w-full flex flex-col mb-4">
          <input
            className="bg-gray-100 p-2 rounded outline-none border focus:border-gray-400 transition-all"
            placeholder="First Name"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>}
        </div>

        <div className="w-full flex flex-col mb-4">
          <input
            className="bg-gray-100 p-2 rounded outline-none border focus:border-gray-400 transition-all"
            placeholder="Last Name"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>}
        </div>

        <div className="w-full flex flex-col mb-4 relative">
          <input
            className="bg-gray-100 p-2 rounded outline-none border focus:border-gray-400 transition-all"
            type={showPassword ? "text" : 'password'}
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
          />
          <div className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black">
            {showPassword ?
              <FaEyeSlash onClick={() => setShowPassword(false)} /> :
              <FaEye onClick={() => setShowPassword(true)} />
            }
          </div>
          {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
        </div>

        <div className="w-full flex flex-col mb-4">
          <input
            className="bg-gray-100 p-2 rounded outline-none border focus:border-gray-400 transition-all"
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match"
            })}
          />
          {errors.confirmPassword && <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>}
        </div>

        {/* Telephone Input */}
        <div className="w-full flex flex-col mb-4">
          <input
            className="bg-gray-100 p-2 rounded outline-none border focus:border-gray-400 transition-all"
            placeholder="Phone Number"
            type="tel" // Use type="tel" for phone numbers
            {...register("telephone", {
              required: "Phone number is required",
              pattern: {
                value: /^01[0-2]\d{8}$/, // Example for Egyptian numbers (11 digits starting with 010, 011, or 012)
                message: "Please enter a valid Egyptian phone number (e.g., 01XXXXXXXXX)"
              }
            })}
          />
          {errors.telephone && <span className="text-red-500 text-xs mt-1">{errors.telephone.message}</span>}
        </div>

        {serverError && <div className="text-red-500 text-sm mb-4 text-center font-medium">{serverError}</div>}

        <div className="text-sm mb-6 text-gray-600">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-blue-600 font-semibold cursor-pointer hover:underline">
            Login
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 cursor-pointer bg-gradient-to-tr from-black to-gray-700 text-white rounded-xl font-bold shadow-md transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'}`}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;