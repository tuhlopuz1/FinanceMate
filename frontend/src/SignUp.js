import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './components/Styles.css';

function SignUp() {
  const navigate = useNavigate();
  const toMain = () => {
      

    navigate('/main');

    console.log('переход в main')
  
  }
  return (
    <div className="container">
    <form className="register-form">
        <h2>Create new account</h2>
        <div className="input-group">
            <label>Enter username</label>
            <input type="text" placeholder="username" required></input>
        </div>
        <div className="input-group">
            <label>Enter your email</label>
            <input type="email" id="email" placeholder="email" required></input>
        </div>
        <div className="input-group">
            <label>Enter your password</label>
            <input type="password" id="password" placeholder="password" required></input>
        </div>
        <button type="button" id="submitButton" onClick={ toMain }>Sign up</button>
        <p className="message">Already have an account? <Link to="/log-in" className='otherVariant'>log in</Link></p>
    </form>
  </div>
  );
}

export default SignUp;