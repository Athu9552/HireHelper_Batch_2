import './Register.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Register = () => {

const [form,setForm] = useState({
  firstName:"",
  lastName:"",
  email:"",
  phone:"",
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
      <div className="registerD">
        <div className="createImg">
          <img id="register-img" src="../src/assets/register.png" alt="Register" />
        <h2>Create Account</h2>
        <p>Join Hire-a-Helper community</p>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="top-sec">
            <div className="left-form">
            <label htmlFor=""><b>First Name</b></label>
            <input type="text" placeholder='First Name' name="firstName" value={form.firstName} onChange={handleChange}/>
            </div>

            <div className="right-form">
            <label htmlFor=""><b>Last Name</b></label>
            <input type="text" placeholder='Last Name' name="lastName" value={form.lastName} onChange={handleChange}/>
            </div>
            </div><br />

            <div className="bottom-sec">
            <label htmlFor=""><b>Email</b></label><br />
            <input type="email" placeholder='Enter Your Email' name="email" value={form.email} onChange={handleChange}/><br /><br />

            <label htmlFor=""><b>Phone Number</b>(Optional)</label><br />
            <input type="tel" placeholder='Enter Your Phone Number' name="phone" value={form.phone} onChange={handleChange} /><br /><br />

            <label htmlFor=""><b>Password</b></label><br />
            <input type="password" placeholder='Enter Your Password' name="password" value={form.password} onChange={handleChange}/>
            </div>

            <button type="submit">Create Account</button>

            <p id='bottP'>Already have an account? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </>
  )
}

export default Register;