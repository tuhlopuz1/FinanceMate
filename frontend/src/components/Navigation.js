// components/Navigation.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="flex items-center justify-between bg-gray-200 px-4 py-2 shadow-md">
      <div className="flex gap-2">
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

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white"
        >
          tuhlopuz1
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white border rounded shadow">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-left w-full hover:bg-gray-100"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
