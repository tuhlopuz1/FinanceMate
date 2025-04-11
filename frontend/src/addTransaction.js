// addTransaction.js
import React, { useState } from 'react';
import Navigation from './components/Navigation';

export default function AddTransaction() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Добавлена транзакция вручную:', { amount, category, date });
  };

  const handleCSVChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    console.log('CSV файл выбран:', file);
  };

  const handleCSVSubmit = (e) => {
    e.preventDefault();
    if (csvFile) {
      console.log('CSV файл отправлен:', csvFile);
      // Здесь будет логика отправки csvFile на сервер
    } else {
      console.log('Файл не выбран');
    }
  };

  return (
    <div>
      <Navigation />
      <form onSubmit={handleSubmit} id="addTr" className="form-container">
        <h2>Добавить транзакцию вручную</h2>

        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Выберите категорию</option>
          <option value="Еда">Еда</option>
          <option value="Транспорт">Транспорт</option>
          <option value="Развлечения">Развлечения</option>
          <option value="Другое">Другое</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
        />

        <button id="submCSV" className="submit" style={{ marginTop: '5x' }}>
          Добавить CSV
        </button>

        <hr style={{ margin: '20px 0', borderColor: '#444' }} />

        <h2>Импорт из CSV</h2>
        <input type="file" accept=".csv" onChange={handleCSVChange} />
        {csvFile && <p>Файл выбран: {csvFile.name}</p>}

        <button onClick={handleCSVSubmit} id="submCSV" className="submit" style={{ marginTop: '5x' }}>
          Добавить CSV
        </button>
      </form>
    </div>
  );
}
