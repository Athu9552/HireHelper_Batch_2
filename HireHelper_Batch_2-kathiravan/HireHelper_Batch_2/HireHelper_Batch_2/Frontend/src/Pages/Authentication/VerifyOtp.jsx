import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Login.css';
import axios from 'axios';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || '';

  const [email_id, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email_id, otp });
      setSuccess(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginD">
      <div className="createImg verify-otp-card">
        <h2>Verify Your Email</h2>
        <p>Enter the 6-digit code sent to your email</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bottom-sec2">
          <label><b>Email address</b></label><br />
          <input type="email" placeholder="Enter Your Email" value={email_id} onChange={(e) => setEmail(e.target.value)} required /><br /><br />

          <label><b>Verification Code</b></label><br />
          <input type="text" maxLength={6} placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify Code'}</button>
      </form>
    </div>
  );
};

export default VerifyOtp;