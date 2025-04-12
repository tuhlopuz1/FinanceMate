// financeHelper.js
import React from 'react';
import Navigation from './components/Navigation';
import Swal from 'sweetalert2';
import './components/Styles.css';

const messages = [
  {
    id: 1,
    text: 'Вы превысили нормальные расходы на супермаркеты в этом месяце',
    date: '2025-04-08T12:34:56',
  },
];

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function FinanceHelper() {
  const handleAdviceClick = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Совет по будущей покупке',
      html:
        `<input id="item-name" class="swal2-input" placeholder="Название покупки">` +
        `<input id="item-amount" class="swal2-input" placeholder="Сумма" type="number">`,
      focusConfirm: false,
      confirmButtonText: 'Проанализировать',
      cancelButtonText: 'Отмена',
      showCancelButton: true,
      background: '#222',
      color: '#fff',
      preConfirm: () => {
        const name = document.getElementById('item-name').value.trim();
        const amount = document.getElementById('item-amount').value.trim();

        if (!name || !amount) {
          Swal.showValidationMessage('Пожалуйста, заполните все поля');
          return false;
        }
        return { name, amount };
      }
    });

    if (formValues) {
      try {
        const response = await fetch(`http://localhost:8000/finance-helper/advice?party_rk=${localStorage.getItem('party_rk')}&name=${encodeURIComponent(formValues.name)}&amount=${formValues.amount}`);
        const data = await response.json();

        Swal.fire({
          title: 'Совет',
          text: data.advice || 'Не удалось получить совет.',
          icon: 'info',
          confirmButtonText: 'ОК',
          background: '#333',
          color: '#fff',
        });
      } catch (error) {
        console.error('Ошибка при получении совета:', error);
        Swal.fire({
          title: 'Ошибка!',
          text: 'Не удалось получить совет. Попробуйте позже.',
          icon: 'error',
          background: '#333',
          color: '#fff',
        });
      }
    }
  };

  const handleMonthlyAnalysis = () => {
    Swal.fire({
      title: 'Анализ предыдущего месяца',
      text: 'Эта функция пока в разработке 😊',
      icon: 'info',
      background: '#333',
      color: '#fff',
    });
  };

  return (
    <div>
      <Navigation />

      <div className="main-container">
        <div className="sidebar">
          <h3 style={{ marginBottom: '20px' }}>Меню</h3>
          <button
            className="submit"
            style={{ marginBottom: '10px', width: '100%' }}
            onClick={handleMonthlyAnalysis}
          >
            Анализ предыдущего месяца
          </button>
          <button
            className="submit"
            style={{ width: '100%' }}
            onClick={handleAdviceClick}
          >
            Совет по будущей покупке
          </button>
        </div>

        <div className="helper-container">
          <h2 id="finHead">Уведомления от финансового помощника</h2>
          <div className="messages">
            {messages.map((msg) => (
              <div className="message" key={msg.id}>
                <div className="message-text">{msg.text}</div>
                <div className="message-date">{formatDate(msg.date)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
