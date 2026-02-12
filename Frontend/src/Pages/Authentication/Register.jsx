import './Register.css';
import registerImg from "../../assets/register.png";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";

const Register = () => {

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email_id, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      first_name,
      last_name,
      email_id,
      password,
      phone
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      alert(res.data.message); 
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
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
                placeholder="First Name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="right-form">
              <label><b>Last Name</b></label>
              <input
                type="text"
                placeholder="Last Name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <br />

          <div className="bottom-sec">
            <label><b>Email</b></label>
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email_id}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <br /><br />

            <label><b>Phone Number (Optional)</b></label>
            <input
              type="tel"
              placeholder="Enter Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <br /><br />

            <label><b>Password</b></label>
            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit">Create Account</button>

          <p id="bottP">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;