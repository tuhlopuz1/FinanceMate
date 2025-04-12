import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './components/Styles.css';

function LogIn() {
  const [activeTab, setActiveTab] = useState('party_rk');
  const [email, setEmail] = useState('');
  const [party_rk, setParty_rk] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = () => {
    const query = new URLSearchParams({ email, password }).toString();
  
    fetch(`http://localhost:8000/auth/log-in-by-email?${query}`, {
      method: 'POST', // можно оставить GET, если сервер так обрабатывает
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        console.log(body)
        localStorage.setItem('party_rk', body.party_rk)
        navigate('/main');
      } else {
        Swal.fire({
          title: 'Ошибка входа',
          text: body.message || 'Неверный email или пароль',
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#1E1E1E',
          color: '#fff'
        });
      }
    })
    .catch(err => {
      console.error(err);
      Swal.fire({
        title: 'Ошибка!',
        text: 'Ошибка соединения с сервером',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#1E1E1E',
        color: '#fff'
      });
    });
  };
  
  const handleParty_rkSubmit = () => {
    const query = new URLSearchParams({ party_rk }).toString();
  
    fetch(`http://localhost:8000/auth/log-in-by-party-rk?${query}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        localStorage.setItem('party_rk', party_rk)
        navigate('/main');
      } else {
        Swal.fire({
          title: 'Ошибка входа',
          text: body.message || 'Неверный party_rk',
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#1E1E1E',
          color: '#fff'
        });
      }
    })
    .catch(err => {
      console.error(err);
      Swal.fire({
        title: 'Ошибка!',
        text: 'Ошибка соединения с сервером',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#1E1E1E',
        color: '#fff'
      });
    });
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
          <>
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
          </>
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

        <button 
          type="button" 
          id="submitButton" 
          onClick={handleSubmit}
        >
          Log in
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
