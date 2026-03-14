import './Register.css';
import registerImg from "../../assets/register.png";
import registerBackground from "../../assets/register-background.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useToast } from "../../components/ToastProvider.jsx";

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email_id, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { first_name, last_name, email_id, password, phone };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      toast?.success(res.data.message || "Registered successfully. Check your email for OTP.");
      navigate("/verify-otp", { state: { email: email_id } });
    } catch (err) {
      toast?.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <img src={registerBackground} alt="Background" className="bg-image" />
      </div>

      <div className="registerD">
        <div className="createImg">
          <img id="register-img" src={registerImg} alt="Register" />
          <h2>Create Account</h2>
          <p>Join Hire-a-Helper community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="top-sec">
            <div className="left-form">
              <label><b>First Name</b></label>
              <input
                type="text"
                placeholder="Enter Your First Name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="right-form">
              <label><b>Last Name</b></label>
              <input
                type="text"
                placeholder="Enter Your Last Name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="bottom-sec">
            <label><b>Email</b></label>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email_id}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label><b>Phone Number (Optional)</b></label>
            <input
              type="tel"
              placeholder="Enter Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label><b>Password</b></label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit">Create Account</button>
          <p id="bottP">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;