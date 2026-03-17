import React, { useState } from 'react';
import './Login.css';
import loginImg from "../../assets/login.png";
import authBackground from "../../assets/register-background.jpg";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useToast } from "../../components/ToastProvider.jsx";

const Login = () => {

  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email_id: form.email,
          password: form.password
        }
      );

      localStorage.setItem("token", res.data.token);
      toast?.success("Logged in successfully");
      navigate("/dashboard");

    } catch (err) {
      toast?.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">

      {/* Background */}
      <div className="auth-background">
        <img
          src={authBackground}
          alt="Background"
          className="auth-bg-image"
        />
      </div>

      {/* Card */}
      <div className="loginD">

        <div className="createImg">
          <img id="login-img" src={loginImg} alt="Login" />
          <h2>Welcome Back</h2>
          <p>Sign in to your Hire-a-helper account</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="bottom-sec2">

            <label><b>Email address</b></label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label><b>Password</b></label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Your Password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="password-input"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

          </div>

          {/* SIGN IN BUTTON */}
          <button type="submit" className="signin-btn">
            Sign in
          </button>

          {/* FORGOT PASSWORD BELOW BUTTON */}
          <div className="forgot-wrapper">
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          <p id="bottP">
            Don't have an account? <Link to="/">Sign up</Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
