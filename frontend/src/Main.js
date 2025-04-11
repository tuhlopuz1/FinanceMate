import React, { useState, useMemo } from 'react';
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

// Зафиксированные цвета для категорий (всего 30)
const predefinedColors = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#00FF00', '#0000FF', '#800080',
  '#FFD700', '#008000', '#FF6347', '#800000', '#FF4500', '#2E8B57', '#D2691E', '#7FFF00',
  '#DC143C', '#F4A460', '#FF1493', '#4169E1', '#ADFF2F', '#B22222', '#A52A2A', '#C71585',
  '#DAA520', '#20B2AA', '#000080', '#F0E68C', '#32CD32', '#9932CC'
];

let expensesList = Array.from({ length: 40 }, (_, i) => ({
  name: `Покупка №${i + 1}`,
  amount: 100 + i * 10,
  category: ['Еда', 'Транспорт', 'Развлечения', 'Другое'][i % 4],
  date: new Date(2025, 3, (i % 30) + 1).toISOString(),
}));

// expensesList = [];

export default function Main() {
  const [filteredCategory, setFilteredCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCategoryFilterChange = (e) => {
    setFilteredCategory(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // Фильтрация расходов по дате и категории
  const filteredExpenses = expensesList.filter((item) => {
    const itemDate = new Date(item.date);
    const isCategoryMatch = filteredCategory ? item.category === filteredCategory : true;
    const isDateMatch =
      (startDate ? itemDate >= new Date(startDate) : true) &&
      (endDate ? itemDate <= new Date(endDate) : true);

    return isCategoryMatch && isDateMatch;
  });

  // Динамическое формирование pieData
  const pieData = useMemo(() => {
    const categoryCounts = filteredExpenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

    return Object.keys(categoryCounts).map((category, index) => ({
      name: category,
      value: categoryCounts[category],
      color: predefinedColors[index % predefinedColors.length],
    }));
  }, [filteredExpenses]);

  // Динамическое формирование lineData
  const lineData = useMemo(() => {
    const dateCounts = filteredExpenses.reduce((acc, item) => {
      const date = new Date(item.date).toLocaleDateString('ru-RU');
      acc[date] = (acc[date] || 0) + item.amount;
      return acc;
    }, {});

    return Object.keys(dateCounts).map((date) => ({
      name: date,
      value: dateCounts[date],
    }));
  }, [filteredExpenses]);

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

        {/* Правая часть: Список расходов с фильтрами */}
        <div className="right-panel">
          {/* Фиксированный блок фильтров */}
          <div className="filter-container">
            <h2>Фильтровать расходы</h2>
            <div className="filter-options">
              <label>
                Категория:
                <select value={filteredCategory} onChange={handleCategoryFilterChange}>
                  <option value="">Все категории</option>
                  {pieData.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Начальная дата:
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </label>

              <label>
                Конечная дата:
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </label>
            </div>
          </div>

          {/* Список расходов */}
          <div className="expense-list-container">
            <h2>Список расходов</h2>
            <ul className="expense-list">
              {filteredExpenses.map((item, index) => {
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
    </div>
  );
}
