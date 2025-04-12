import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './components/Styles.css';

function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salary, setSalary] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  const handleRegister = () => {
    const data = {
      email,
      password,
      salary,
      gender,
      age
    };
    console.log(data)
    fetch('http://localhost:8000/auth/sign-up', {
      method: 'POST', // Используем POST
      headers: {
        'Content-Type': 'application/json' // Устанавливаем тип контента
      },
      body: JSON.stringify(data) // Передаем данные в теле запроса
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        console.log(body)
        localStorage.setItem('party_rk', body.party_rk)
        navigate('/main');
      } else {
        Swal.fire({
          title: 'Ошибка регистрации',
          text: body.message || 'Ошибка при регистрации, попробуйте снова.',
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

  return (
    <div className="container">
      <form className="register-form">
        <h2>Создать новый аккаунт</h2>

        <div className="input-group">
          <label>Введите свою почту</label>
          <input
            type="email"
            placeholder="почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Введите пароль</label>
          <input
            type="password"
            placeholder="пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Введите зарплату</label>
          <input
            type="number"
            placeholder="зарплата"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Выберите гендер</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Выберите</option>
            <option value="M">Мужской</option>
            <option value="F">Женский</option>
          </select>
        </div>

        <div className="input-group">
          <label>Введите возраст</label>
          <input
            type="number"
            placeholder="возраст"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <button id='sbtn' type="button" onClick={handleRegister}>Зарегистрироваться</button>

        <p className="message">
          Уже есть аккаунт?{' '}
          <Link to="/log-in" className="otherVariant">Войти</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
