import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Swal from 'sweetalert2';
import './components/Styles.css';
import { marked } from 'marked'; 
export default function FinanceHelper() {
  const [messages, setMessages] = useState([]);

  // Загрузка уведомлений при монтировании
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8000/notifications/get-notifications?party_rk=${localStorage.getItem('party_rk')}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error('Неверный формат данных от сервера:', data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке уведомлений:', error);
      }
    };

    loadMessages();
  }, []);


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
  
        const markdownResult = data.result || 'Не удалось получить совет.';
        const htmlResult = marked.parse(markdownResult); // 👈 парсим Markdown в HTML
  
        Swal.update({
          title: 'Совет',
          html: `<div style="font-size: 16px;">${htmlResult}</div>`, // 👈 вставляем HTML
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
  

  const handleMonthlyAnalysis = async () => {
    const party_rk = localStorage.getItem('party_rk');
  
    Swal.fire({
      title: 'Отправка запроса...',
      html: `
        <table style="width: 100%; text-align: left; font-size: 16px;">
          <tr><td>📤</td><td>Отправлен запрос на анализ</td></tr>
          <tr><td>⏳</td><td>Скоро в ваших уведомлениях появится отчёт</td></tr>
        </table>
      `,
      icon: 'info',
      background: '#333',
      color: '#fff',
      confirmButtonText: 'ОК'
    });
  
    try {
      await fetch(`http://localhost:8000/summary?party_rk=${encodeURIComponent(party_rk)}`);
      // можно добавить лог или ещё одну Swal при успехе, но выше уже есть инфо
    } catch (error) {
      console.error('Ошибка при отправке запроса на анализ:', error);
      Swal.fire({
        title: 'Ошибка',
        text: 'Не удалось отправить запрос. Попробуйте позже.',
        icon: 'error',
        background: '#333',
        color: '#fff',
      });
    }
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
