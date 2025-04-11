// financeHelper.js
import React from 'react';
import Navigation from './components/Navigation';
import './components/Styles.css';
const messages = [
  {
    id: 1,
    text: 'Вы потратили слишком много на еду в этом месяце. Попробуйте сократить расходы на 15%.',
    date: '2025-04-08T12:34:56',
  },
  {
    id: 2,
    text: 'У вас всё хорошо с транспортными расходами — они снизились на 20% по сравнению с прошлым месяцем.',
    date: '2025-04-09T09:21:00',
  },
  {
    id: 3,
    text: 'Вы можете отложить ещё 5,000₽ в этом месяце, чтобы достичь финансовой цели быстрее.',
    date: '2025-04-10T17:05:12',
  },
  {
    id: 3,
    text: 'Вы можете отложить ещё 5,000₽ в этом месяце, чтобы достичь финансовой цели быстрее.',
    date: '2025-04-10T17:05:12',
  },
  {
    id: 3,
    text: 'Вы можете отложить ещё 5,000₽ в этом месяце, чтобы достичь финансовой цели быстрее.',
    date: '2025-04-10T17:05:12',
  },
  {
    id: 3,
    text: 'Вы можете отложить ещё 5,000₽ в этом месяце, чтобы достичь финансовой цели быстрее.',
    date: '2025-04-10T17:05:12',
  },
  {
    id: 3,
    text: 'Вы можете отложить ещё 5,000₽ в этом месяце, чтобы достичь финансовой цели быстрее.',
    date: '2025-04-10T17:05:12',
  },
  {
    id: 3,
    text: 'Вы можете отложить ещё 5,000₽ в этом месяце, чтобы достичь финансовой цели быстрее.',
    date: '2025-04-10T17:05:12',
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
  return (
    <div>
      <Navigation />
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
  );
}
