// financeHelper.js
import React from 'react';
import Navigation from './components/Navigation';
import Swal from 'sweetalert2';
import './components/Styles.css';

const messages = [
  {
    text: 'Вы превысили нормальные расходы на супермаркеты в этом месяце 1',
    date: '2025-04-03',
  },
  {
    text: 'Вы превысили нормальные расходы на супермаркеты в этом месяце 2 ',
    date: '2025-04-03',
  }
];


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
      // Показываем модалку с колесом загрузки
      Swal.fire({
        title: 'Анализируем...',
        html: '<div class="swal2-loading" style="font-size: 18px;">Пожалуйста, подождите</div>',
        allowOutsideClick: false,
        background: '#333',
        color: '#fff',
        didOpen: () => {
          Swal.showLoading();
        }
      });
  
      try {
        const response = await fetch(
          `http://localhost:8000/ai/future-advice?party_rk=${localStorage.getItem('party_rk')}&name=${encodeURIComponent(formValues.name)}&amt=${formValues.amount}`
        );
        const data = await response.json();
  
        // Обновляем текущее модальное окно с результатом
        Swal.update({
          title: 'Совет',
          html: `<div style="font-size: 16px;">${data.result || 'Не удалось получить совет.'}</div>`,
          icon: 'info',
          showConfirmButton: true,
          confirmButtonText: 'ОК',
        });
        Swal.hideLoading();
      } catch (error) {
        console.error('Ошибка при получении совета:', error);
        Swal.update({
          title: 'Ошибка!',
          html: '<div style="font-size: 16px;">Не удалось получить совет. Попробуйте позже.</div>',
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'ОК',
        });
        Swal.hideLoading();
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
          {messages.length === 0 ? (
            <div className="message">Нет новых уведомлений</div>
          ) : (
            messages.map((msg, index) => (
              <div className="message" key={index}>
                <div className="message-text">{msg.text}</div>
                <div className="message-date">{msg.date}</div>
              </div>
            ))
          )}
        </div>
      </div>

      </div>
    </div>
  );
}
