import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //Login API Calls
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      //Handle successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle login error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    }
  };

  return (
    <div className="min-h-screen bg-cyan-50 relative">
      {/* Background UI Elements */}
      <div className="login-ui-box right-10 -top-40 hidden md:block" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2 hidden md:block" />

      {/* Main Container */}
      <div className="container flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-10 mx-auto space-y-10 md:space-y-0 md:space-x-6 overflow-auto">
        {/* Left Side (Image & Text) */}
        <div className="w-full md:w-2/4 h-[60vh] md:h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-8 md:p-10 z-50">
          <div>
            <h4 className="text-4xl md:text-5xl text-white font-semibold leading-snug md:leading-[50px]">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-sm md:text-[15px] text-white leading-6 pr-2 md:pr-7 mt-4">
              Record your travel experiences and memories in your personal
              travel journal.
            </p>
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-2/4 bg-white rounded-lg md:rounded-r-lg p-6 md:p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleLogin}>
            <h4 className="text-xl md:text-2xl font-semibold mb-6">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary w-full">
              LOGIN
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="button"
              className="btn-primary btn-light w-full"
              onClick={() => navigate("/signUp")}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
