import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/register", form);
      setSuccess(res.data.message);
      setTimeout(() => navigate("/"), 1500); // redirect to login
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex  justify-center items-center  bg-gray-900 ">
      <div className="flex p-30 h-screen w-full rounded-2xl">
        <div className="hidden lg:flex items-center  justify-center lg:w-fit bg-indigo-200 text-black p-10">
          <DotLottieReact
            src="https://lottie.host/9b0a2c2e-98d1-4359-9fb2-816a02e71730/B9W1pzyJa9.lottie"
            loop
            autoplay
          />
        </div>
        <div className="w-full bg-gray-100 lg:w-1/2 flex items-center justify-center ">
          <div className="max-w-md w-full p-6">
            <h1 className="text-2xl uppercase font-bold mb-6 text-blue-950 text-center">
              Register
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-500 text-center">
              Join to Our Crawler with all time access and free
            </h1>

            <div className="mt-4 text-sm text-gray-600 text-center">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-900 mb-2">{success}</p>}
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-blue-950  text-white p-2 rounded-md hover:bg-gray-800  focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  Register Now
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-blue-950 hover:underline font-bold"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
