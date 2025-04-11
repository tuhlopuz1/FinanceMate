// financeHelper.js
import React from 'react';
import Navigation from './components/Navigation';

const messages = [
  { date: '2025-04-01', text: 'Потратите меньше на кафе в этом месяце.' },
  { date: '2025-04-05', text: 'Вы потратили больше, чем обычно на транспорт.' },
  { date: '2025-04-10', text: 'Хорошая работа! Вы сократили расходы на развлечения.' },
];

export default function FinanceHelper() {
  return (
    <div>
      <Navigation />
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-xl mb-4">Финансовый помощник</h2>
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className="border p-3 rounded shadow">
              <div className="text-gray-500 text-sm">{msg.date}</div>
              <div>{msg.text}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
