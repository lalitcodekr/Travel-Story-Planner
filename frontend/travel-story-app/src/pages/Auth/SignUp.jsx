import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //SignUp API Calls
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
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
      {/* Background UI Boxes - hidden on mobile */}
      <div className="login-ui-box right-10 -top-40 hidden md:block" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2 hidden md:block" />

      {/* Main Container */}
      <div className="container flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-10 mx-auto space-y-10 md:space-y-0 md:space-x-6 overflow-auto">
        {/* Left Side - Background Image & Text */}
        <div className="w-full md:w-2/4 h-[60vh] md:h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-8 md:p-10 z-50">
          <div>
            <h4 className="text-4xl md:text-5xl text-white font-semibold leading-snug md:leading-[50px]">
              Join the <br /> Adventure
            </h4>
            <p className="text-sm md:text-[15px] text-white leading-6 pr-2 md:pr-7 mt-4">
              Create an account to start documenting your travels and preserving
              your memories in your personal travel journal.
            </p>
          </div>
        </div>

        {/* Right Side - SignUp Form */}
        <div className="w-full md:w-2/4 bg-white rounded-lg md:rounded-r-lg p-6 md:p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignUp}>
            <h4 className="text-xl md:text-2xl font-semibold mb-6">SignUp</h4>

            <input
              type="text"
              placeholder="Full Name"
              className="input-box"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />

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
              CREATE ACCOUNT
            </button>

            <p className="text-xs text-slate-500 text-center my-4">Or</p>

            <button
              type="button"
              className="btn-primary btn-light w-full"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
