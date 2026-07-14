import axios from 'axios';
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
type Inputs = {
  email: string;

  password: string;

}


type Props = {}

const Login = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    setServerError(null); // Clear previous errors
    try {

      const res = await axios.post(`${import.meta.env.VITE_SERVER}/auth/login`, data)
      if (res.status == 200) {
        Cookies.set("token", res.data)

        // This part seems to associate the visitor token with the logged-in user.
        // It's good to keep this logic if intended.
        // const visitorRes = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/get-user`, { vt: localStorage.getItem("vt") }
        //   , {
        //     headers: {
        //       Authorization: `Bearer ${res.data}`,
        //       vToken: `Bearer ${localStorage.getItem("vt")}`
        //     }
        //   })
        // Optionally clear visitor token from localStorage if it's now associated with the user
        // localStorage.removeItem("vt");
        navigate("/shopping")

      }
      else {
        // Handle non-200 status codes from the server
        setServerError(res.data?.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login API error:", err); // Log the full error for debugging
      if (axios.isAxiosError(err) && err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx.
        // The server (Auth.js) sends different types of data for different errors:
        // - 401/403: plain string message (e.g., "Wrong password")
        // - 400: object with a 'message' property (e.g., { message: "Internal Server Error" })
        const serverMessage = err.response.data?.message || err.response.data;
        if (serverMessage) {
          setServerError(serverMessage);
        } else {
          setServerError("Login failed. Please check your credentials.");
        }
      } else if (err.request) {
        // The request was made but no response was received (e.g., network error)
        setServerError("No response from server. Please check your internet connection.");
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full flex min-h-[80vh] justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className=" rounded-sm shadow-2xl max-w-[300px] flex flex-col items-center p-4">
        <input className="bg-gray-200 m-2" placeholder="email@example.com" {...register("email", { pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })} />
        {errors.email && <span className="text-red-500">Please enter a valid email</span>}
        <div className="relative">
          <input className="bg-gray-200 m-2" type={showPassword ? "text" : 'password'} placeholder="password" {...register("password")} />
          {showPassword ?
            <FaEyeSlash onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3" />
            : <FaEye onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3" />
          }</div>
        {errors.password && <span className="text-red-500">Password is required</span>}
        {serverError && <span className="text-red-500 mt-2">{"plz try again"}</span>}
        <div className="">You have not email, <span onClick={() => navigate("/signup")} className="text-blue-500 cursor-pointer">Sign up</span></div>
        <button type="submit"
          disabled={loading}
          className={`px-4 py-2 mt-4 cursor-pointer bg-gradient-to-tr from-black to-gray-700 text-white rounded-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login