import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/login", form);
      const token = res.data.token;

      localStorage.setItem("token", token); // 🔐 Store JWT
      navigate("/dashboard"); // Redirect to protected page
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
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
        <div className=" bg-gray-100 flex items-center justify-center lg:w-1/2 w-full">
          <div className="max-w-md w-full p-6">
            <h1 className="text-2xl uppercase font-bold mb-6 text-blue-950 text-center">
              Login
            </h1>
            <h1 className="text-sm font-semibold mb-6 text-gray-600 text-center">
              Join to Our Crawler with all time access and free
            </h1>

            <div className="mt-4 text-sm text-gray-600 text-center">
              {error && <p className="text-red-500 mb-4">{error}</p>}
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
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
                  Login Now
                </button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-950 hover:underline font-bold"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
