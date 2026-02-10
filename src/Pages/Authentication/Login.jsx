import React from 'react'
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <>
     <div className="loginD">
        <div className="createImg">
          <img id="login-img" src="../src/assets/login.png" alt="Login" />
        <h2>Welcome Back</h2>
        <p>Sign in to your Hire-a-account</p>
        </div>

        <form action="">

            <div className="bottom-sec2">
            <label htmlFor=""><b>Email address</b></label><br />
            <input type="email" placeholder='Enter Your Email' /><br /><br />

            <label htmlFor=""><b>Password</b></label><br />
            <input type="password" placeholder='Enter Your Password' name="password" id="password" />
            </div>

            <button>Sign in</button>

            <p id='bottP'>Don't have an account <Link to="/">Sign up</Link></p>
        </form>
      </div>
    </>
  )
}

export default Login;