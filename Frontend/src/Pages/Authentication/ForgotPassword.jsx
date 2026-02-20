import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import authBackground from '../../assets/register-background.jpg';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email_id, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email_id });
      setSuccess(res.data.message || 'Reset code sent to your email');
      // Redirect to reset page with email prefilled
      setTimeout(() => {
        navigate('/reset-password', { state: { email: email_id } });
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start password reset');
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
          <h2>Forgot Password</h2>
          <p>Enter your registered email to receive a reset code</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bottom-sec2">
            <label><b>Email address</b></label>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email_id}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

