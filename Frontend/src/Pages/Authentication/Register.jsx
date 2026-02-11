import './Register.css';
import { Link } from 'react-router-dom';

const Register = () => {


  
  return (
    <>
      <div className="registerD">
        <div className="createImg">
          <img id="register-img" src="../src/assets/register.png" alt="Register" />
        <h2>Create Account</h2>
        <p>Join Hire-a-Helper community</p>
        </div>

        <form action="">
            <div className="top-sec">
            <div className="left-form">
            <label htmlFor=""><b>First Name</b></label>
            <input type="text" placeholder='First Name' />
            </div>

            <div className="right-form">
            <label htmlFor=""><b>Last Name</b></label>
            <input type="text" placeholder='Last Name' />
            </div>
            </div><br />

            <div className="bottom-sec">
            <label htmlFor=""><b>Email</b></label><br />
            <input type="email" placeholder='Enter Your Email' /><br /><br />

            <label htmlFor=""><b>Phone Number</b>(Optional)</label><br />
            <input type="tel" placeholder='Enter Your Phone Number'/><br /><br />

            <label htmlFor=""><b>Password</b></label><br />
            <input type="password" placeholder='Enter Your Password' name="password" id="password" />
            </div>

            <button>Create Account</button>

            <p id='bottP'>Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </>
  )
}

export default Register;