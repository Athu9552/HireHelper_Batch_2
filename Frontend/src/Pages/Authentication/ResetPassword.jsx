import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import authBackground from '../../assets/register-background.jpg';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const location = useLocation();
  const initialEmail = location.state?.email || '';
  const [form, setForm] = useState({
    email_id: initialEmail,
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email_id: form.email_id,
        otp: form.otp,
        newPassword: form.password
      });
      setSuccess(res.data.message || 'Password reset successful. You can now log in.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <img src={authBackground} alt="Background" className="auth-bg-image" />
      </div>

      <div className="loginD">
        <div className="createImg">
          <h2>Reset Password</h2>
          <p>Enter the code from your email and choose a new password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bottom-sec2">
            <label><b>Email address</b></label>
            <input
              type="email"
              name="email_id"
              placeholder="Enter Your Email"
              value={form.email_id}
              onChange={handleChange}
              required
            />

            <label><b>Reset Code (OTP)</b></label>
            <input
              type="text"
              name="otp"
              maxLength={6}
              placeholder="000000"
              value={form.otp}
              onChange={handleChange}
              required
            />

            <label><b>New Password</b></label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter New Password"
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <label><b>Confirm New Password</b></label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

