import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleProfileClick = async () => {
    const party_rk = localStorage.getItem('party_rk');
  
    try {
      const response = await fetch(`http://localhost:8000/users/get-user-data?party_rk=${party_rk}`);
      const userData = await response.json();
  
      const salary = userData.monthly_income_amt || '';
      const age = userData.age || '';
      const gender = userData.gender_cd === 'M' ? 'male' : userData.gender_cd === 'F' ? 'female' : 'other';
  
      const { value: formValues } = await Swal.fire({
        title: 'Профиль пользователя',
        html: `
          <input id="profile-salary" class="swal2-input" placeholder="Зарплата" type="number">
          <input id="profile-age" class="swal2-input" placeholder="Возраст" type="number">
          <select id="profile-gender" class="swal2-input">
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
          <p>party_rk: ${localStorage.getItem('party_rk').toString()}</p>
        `,
        didOpen: () => {
          document.getElementById('profile-salary').value = salary;
          document.getElementById('profile-age').value = age;
          document.getElementById('profile-gender').value = gender;
        },
        showCancelButton: true,
        confirmButtonText: 'Сохранить',
        cancelButtonText: 'Отмена',
        background: '#333',
        color: '#fff',
        focusConfirm: false,
        preConfirm: () => {
          const salary = document.getElementById('profile-salary').value.trim();
          const age = document.getElementById('profile-age').value.trim();
          const gender = document.getElementById('profile-gender').value;
  
          if (!salary || !age || !gender) {
            Swal.showValidationMessage('Пожалуйста, заполните все поля');
            return false;
          }
  
          return { salary, age, gender };
        }
      });
  
      if (formValues) {
        const genderCode = formValues.gender === 'male' ? 'M' : formValues.gender === 'female' ? 'F' : 'O';
  
        await fetch(
          `http://localhost:8000/users/put-user-data?party_rk=${party_rk}&gender=${genderCode}&age=${formValues.age}&salary=${formValues.salary}`,
          { method: 'PUT' }
        );
  
        Swal.fire({
          icon: 'success',
          title: 'Сохранено!',
          text: 'Профиль обновлён.',
          background: '#333',
          color: '#fff',
        });
      }
  
    } catch (error) {
      console.error('Ошибка при получении/сохранении профиля:', error);
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: 'Не удалось получить или сохранить данные профиля.',
        background: '#333',
        color: '#fff',
      });
    }
  };
  

  return (
    <nav id="navP" className="flex items-center justify-between bg-gray-200 px-4 py-2 shadow-md">
      <div className="flex gap-2">
        <Link to="/main">
          <span id="logo" className="text-2xl font-bold text-gray-800 cursor-pointer">FinanceMate</span>
        </Link>
        <Link to="/main">
          <button className="bg-white px-4 py-1 rounded shadow">Главная</button>
        </Link>
        <Link to="/add-transaction">
          <button className="bg-white px-4 py-1 rounded shadow">Добавить транзакцию</button>
        </Link>
        <Link to="/finance-helper">
          <button className="bg-white px-4 py-1 rounded shadow">Финансовый помощник</button>
        </Link>
      </div>

      <div className="relative inline-block">
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="px-3 py-1 rounded-full bg-gray-400 text-white"
    id = "userBtn"
  >
    Пользователь
  </button>

  {menuOpen && (
    <div id="dropMenu" className="absolute right-0 mt-2 bg-white border rounded shadow w-40 z-50">
      <button
        onClick={handleProfileClick}
        className="px-4 py-2 text-left w-full hover:bg-gray-100"
        id="profBtn"
      >
        Профиль
      </button>
      <br></br>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-left w-full hover:bg-gray-100"
        id="logoutBtn"
      >
        Выйти
      </button>
    </div>
  )}
</div>

    </nav>
  );
}
