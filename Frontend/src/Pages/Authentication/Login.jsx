import React, { useState } from 'react'
import './Login.css';
import loginImg from "../../assets/login.png";
import { Link } from 'react-router-dom';
import axios from "axios";

const Login = () => {

const [form,setForm] = useState({
  email:"",
  password:""
});

const handleChange = (e)=>{
  setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit = async (e)=>{
  e.preventDefault();

  try{
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email_id: form.email,
        password: form.password
      }
    );

    localStorage.setItem("token", res.data.token);
    alert("Login successful");
    window.location.href="/dashboard";

  }catch(err){
    alert(err.response?.data?.message || "Login failed");
  }
};

return (
  <>
   <div className="loginD">
      <div className="createImg">
        <img id="login-img" src={loginImg} alt="Login" />
      <h2>Welcome Back</h2>
      <p>Sign in to your Hire-a-account</p>
      </div>

      <form onSubmit={handleSubmit}>

          <div className="bottom-sec2">
          <label><b>Email address</b></label><br />
          <input type="email" placeholder='Enter Your Email' name="email" value={form.email} onChange={handleChange} required/><br /><br />

          <label><b>Password</b></label><br />
          <input type="password" placeholder='Enter Your Password' name="password" value={form.password} onChange={handleChange} required minLength={6}/>
          </div>

          <button type="submit">Sign in</button>

          <p id='bottP'>Don't have an account <Link to="/">Sign up</Link></p>
      </form>
    </div>
  </>
)
}

export default Login;