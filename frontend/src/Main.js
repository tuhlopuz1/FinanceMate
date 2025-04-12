import React, { useState, useEffect, useMemo } from 'react';
import Navigation from './components/Navigation';
import './components/Styles.css';
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

// Зафиксированные цвета для категорий
const predefinedColors = [
  '#0088FE','#00C49F','#FFBB28','#FF8042','#FF0000','#00FF00','#0000FF','#800080','#FFD700','#008000',
  '#FF6347','#800000','#FF4500','#2E8B57','#D2691E','#7FFF00','#DC143C','#F4A460','#FF1493','#4169E1',
  '#ADFF2F','#B22222','#A52A2A','#C71585','#DAA520','#20B2AA','#000080','#F0E68C','#32CD32','#9932CC',
  '#E9967A','#4B0082','#00CED1','#FF69B4','#B0C4DE','#7B68EE','#8B008B','#3CB371','#6A5ACD','#DB7093',
  '#CD5C5C','#8FBC8F','#483D8B','#6495ED','#FFB6C1','#708090','#778899','#BDB76B','#00FA9A','#C0C0C0',
  '#BA55D3','#66CDAA','#FA8072','#00BFFF','#8A2BE2','#48D1CC','#FFDAB9','#FFE4B5','#E0FFFF','#FFE4E1',
  '#7CFC00','#FAFAD2','#90EE90','#40E0D0','#E6E6FA','#F5DEB3','#F08080','#9370DB','#C8A2C8','#D8BFD8',
  '#B8860B','#F5F5DC','#F0FFF0','#B0E0E6','#87CEFA'
];


export default function Main() {
  const [expenses, setExpenses] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:8000/transactions?party_rk=646743487');
        const data = await response.json();
  
        const normalizedData = data.map(item => ({
          ...item,
          amount: parseFloat(item.amount),
          date: new Date(item.date).toISOString(),
        }));
  
        setExpenses(normalizedData);
      } catch (error) {
        console.error('Ошибка при загрузке расходов:', error);
      }
    };
  
    fetchExpenses();
  }, []);

  // Фильтрация
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const itemDate = new Date(item.date);
      const isCategoryMatch = filteredCategory ? item.category === filteredCategory : true;
      const isDateMatch =
        (startDate ? itemDate >= new Date(startDate) : true) &&
        (endDate ? itemDate <= new Date(endDate) : true);
      return isCategoryMatch && isDateMatch;
    });
  }, [expenses, filteredCategory, startDate, endDate]);

  // Категории и pieData
  const pieData = useMemo(() => {
    const categoryTotals = {};
    filteredExpenses.forEach(item => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    return Object.entries(categoryTotals).map(([category, value], index) => ({
      name: category,
      value,
      color: predefinedColors[index % predefinedColors.length],
    }));
  }, [filteredExpenses]);

  // Данные для графика
  const lineData = useMemo(() => {
    const dateTotals = {};
    filteredExpenses.forEach(item => {
      const date = new Date(item.date).toLocaleDateString('ru-RU');
      dateTotals[date] = (dateTotals[date] || 0) + item.amount;
    });

    return Object.entries(dateTotals).map(([date, value]) => ({
      name: date,
      value,
    }));
  }, [filteredExpenses]);

  return (
    <div>
      <Navigation />
      <div className="main-container">
        <div className="left-panel">
          <div className="top-left">
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

            <div>
            <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx={200}
              cy={200}
              innerRadius={80}
              outerRadius={130}
              dataKey="value"
              label
              labelLine={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
              <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
                Всего: {filteredExpenses.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}₽
              </div>
            </div>
          </div>

          <div className="bottom-left">
            <h2>График расходов</h2>
            <ResponsiveContainer id="gr" width="100%" height={200}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#00C49F" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="right-panel">
          <div className="filter-container">
            <h2>Фильтровать расходы</h2>
            <div className="filter-options">
              <label>
                Категория:
                <select value={filteredCategory} onChange={e => setFilteredCategory(e.target.value)}>
                  <option value="">Все категории</option>
                  {[...new Set(expenses.map(e => e.category))].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label>
                Начальная дата:
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </label>

              <label>
                Конечная дата:
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </label>
            </div>
          </div>

          <div className="expense-list-container">
            <h2>Список расходов</h2>
            <ul className="expense-list">
              {filteredExpenses.map((item, index) => {
                const color = pieData.find(cat => cat.name === item.category)?.color || '#ccc';
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
    </div>
  );
}
