import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Swal from 'sweetalert2';
import './components/Styles.css';

export default function AddTransaction() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [newCategory, setNewCategory] = useState(''); // Для новой категории
  const [categories, setCategories] = useState(['Еда', 'Транспорт', 'Развлечения', 'Другое']); // Существующие категории

  const handleSubmit = (e) => {
    e.preventDefault();

    if (category === 'new') {
      // Если выбрана новая категория, показываем модальное окно
      handleNewCategory();
    } else {
      console.log('Добавлена транзакция:', { amount, category, date });
      Swal.fire({
        title: 'Успех!',
        text: 'Транзакция добавлена',
        icon: 'success',
        confirmButtonText: 'ОК',
        background: '#333',
        color: '#fff',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = window.location.href; // Перезагружаем страницу
        }
      });
    }
  };

  const handleNewCategory = () => {
    Swal.fire({
      title: 'Создать новую категорию',
      html: `
        <input type="text" id="newCategoryInput" class="swal2-input" placeholder="Название новой категории">
        <div style="margin-top: 10px;">
          <label>
            <input type="checkbox" id="saveCategoryCheckbox"> Сохранить категорию на будущее
          </label>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Создать',
      cancelButtonText: 'Отмена',
      background: '#222',
      color: '#fff',
      preConfirm: () => {
        const newCategoryName = document.getElementById('newCategoryInput').value.trim();
        const shouldSave = document.getElementById('saveCategoryCheckbox').checked;
        if (!newCategoryName) {
          Swal.showValidationMessage('Пожалуйста, введите название категории');
          return false;
        }
        return { newCategoryName, shouldSave };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { newCategoryName, shouldSave } = result.value;
        // Добавляем транзакцию с новой категорией
        console.log('Добавлена транзакция с новой категорией:', { amount, category: newCategoryName, date });

        // Если пользователь выбрал сохранить категорию
        if (shouldSave && !categories.includes(newCategoryName)) {
          setCategories((prevCategories) => [...prevCategories, newCategoryName]);
        }

        Swal.fire({
          title: 'Успех!',
          text: 'Транзакция добавлена',
          icon: 'success',
          confirmButtonText: 'ОК',
          background: '#333',
          color: '#fff',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = window.location.href; // Перезагружаем страницу
          }
        });
      }
    });
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
      Swal.fire({
        title: 'Успех!',
        text: 'Транзакции из файла добавлены',
        icon: 'success',
        confirmButtonText: 'ОК',
        background: '#333',
        color: '#fff',
      });
    } else {
      console.log('Файл не выбран');
    }
  };

  return (
    <div>
      <Navigation />
      <form onSubmit={handleSubmit} id="addTr" className="form-container">
        <h2>Добавить транзакцию вручную</h2>

        <input type="text" placeholder="Название (необязательно)" />

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
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
          <option value="new">Создать новую категорию</option> {/* Новый вариант */}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
        />

        <button id="submCSV" className="submit" style={{ marginTop: '5x' }}>
          Добавить
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
