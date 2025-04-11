import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function LogIn() {
  const [activeTab, setActiveTab] = useState('party_rk');
  const [email, setEmail] = useState('');
  const [party_rk, setParty_rk] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSubmit = () => {
    console.log('Email login attempt:', { email, password });
  };

  const handleParty_rkSubmit = () => {
    Swal.fire({
      title: 'Error!',
      text: 'lskjhfgskjfghksjdfhgksjfdhg',
      icon: 'error',
      confirmButtonText: 'OK',
      background: '#1E1E1E',
      color: '#fff'
    });
    console.log('party_rk login attempt:', { party_rk });
  };

  const handleSubmit = () => {
    if (activeTab === 'email') {
      handleEmailSubmit();
    } else {
      handleParty_rkSubmit();
    }
  };

  return (
    <div className="container">
      <form className="register-form">
        <h2>Log in to your account</h2>
        
        <div className="tabs">
          <button
            type="button"
            className={`tab ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            Email
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'party_rk' ? 'active' : ''}`}
            onClick={() => setActiveTab('party_rk')}
          >
            By party_rk
          </button>
        </div>

        {activeTab === 'email' ? (
          <div className="input-group">
            <label>Enter your email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email" 
              required 
            />
          </div>
        ) : (
          <div className="input-group">
            <label>Enter your party_rk</label>
            <input 
              type="tel" 
              value={party_rk}
              onChange={(e) => setParty_rk(e.target.value)}
              placeholder="party_rk"
              required 
            />
          </div>
        )}

        {activeTab === 'email' && (
          <div className="input-group">
            <label>Enter your password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password" 
              required 
            />
          </div>
        )}

        <button 
          type="button" 
          id="submitButton" 
          onClick={handleSubmit}
        >
          {activeTab === 'party_rk' ? 'Log in' : 'Log in'}
        </button>
        
        <p className="message">
          Don't have an account? {' '}
          <Link to="/sign-up" className='otherVariant'>Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default LogIn;