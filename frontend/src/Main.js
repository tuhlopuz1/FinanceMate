import React from 'react';
import Navigation from './components/Navigation';
import './components/Styles.css'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const pieData = [
  { name: 'Еда', value: 400, color: '#0088FE' },
  { name: 'Транспорт', value: 300, color: '#00C49F' },
  { name: 'Развлечения', value: 300, color: '#FFBB28' },
  { name: 'Другое', value: 200, color: '#FF8042' },
];

const lineData = [
  { name: '01.04', value: 200 },
  { name: '05.04', value: 400 },
  { name: '10.04', value: 100 },
  { name: '15.04', value: 500 },
  { name: '20.04', value: 300 },
];

const expensesList = Array.from({ length: 40 }, (_, i) => ({
  name: `Покупка №${i + 1}`,
  amount: 100 + i * 10,
  category: pieData[i % pieData.length].name,
  date: new Date(2025, 3, (i % 30) + 1).toISOString(),
}));

export default function Main() {
  return (
    <div>
      <Navigation />
      <div className="main-container">
        {/* Левая часть экрана */}
        <div className="left-panel">
          <div className="top-left">
            {/* Легенда */}
            <div className="legend">
              <h3>Категории:</h3>
              <ul>
                {pieData.map((item, index) => (
                  <li key={index}>
                    <span className="color-box" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Круговая диаграмма */}
            <div>
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  cx={150}
                  cy={150}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>

          {/* График под ними */}
          <div className="bottom-left">
            <h2>График расходов</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#00C49F" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Правая часть: список расходов */}
        <div className="right-panel">
          <h2>Список расходов</h2>
          <ul className="expense-list">
            {expensesList.map((item, index) => {
              const categoryData = pieData.find((cat) => cat.name === item.category);
              const color = categoryData ? categoryData.color : '#ccc';

              const formattedDate = new Date(item.date).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });

              return (
                <li key={index} className="expense-item">
                  <span className="color-box" style={{ backgroundColor: color }}></span>
                  <div className="expense-info">
                    <div>{item.name} — {item.amount}₽</div>
                    <div className="expense-meta">
                      <span className="expense-date">{formattedDate}</span>
                      <span className="category-name">({item.category})</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
