import React from 'react'
import './Login.css';
import loginImg from "../../assets/login.png";
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {

const [form,setForm] = useState({
  email:"",
  password:""
});

const handleChange = (e)=>{
  setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit = (e)=>{
  e.preventDefault();
  console.log(form);
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
            <label htmlFor=""><b>Email address</b></label><br />
            <input type="email" placeholder='Enter Your Email' name="email" value={form.email} onChange={handleChange} required/><br /><br />

            <label htmlFor=""><b>Password</b></label><br />
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