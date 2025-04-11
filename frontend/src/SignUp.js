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
        <h2>Создать новый аккаунт</h2>
        <div className="input-group">
            <label>Введите свою почту</label>
            <input type="email" id="email" placeholder="почта" required></input>
        </div>
        <div className="input-group">
            <label>Введите пароль</label>
            <input type="password" id="password" placeholder="пароль" required></input>
        </div>
        <button type="button" id="submitButton" onClick={ toMain }>Зарегистрироваться</button>
        <p className="message">Уже есть аккаунт? <Link to="/log-in" className='otherVariant'>Войти</Link></p>
    </form>
  </div>
  );
}

export default SignUp;