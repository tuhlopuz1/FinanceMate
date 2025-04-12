import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Swal from 'sweetalert2';
import './components/Styles.css';


export default function AddTransaction() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [brandName, setBrandName] = useState(''); // Название покупки
  const [csvFile, setCsvFile] = useState(null);
  const [categories, setCategories] = useState(['Еда', 'Транспорт', 'Развлечения', 'Другое']);

  useEffect(() => {
    fetch('http://localhost:8000/transactions/get-categories?party_rk=' + localStorage.getItem('party_rk'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(prev => Array.from(new Set([...prev, ...data])));
        }
      })
      .catch(err => {
        console.error('Ошибка при загрузке категорий:', err);
      });
  }, []);

  const sendTransactionToBackend = (amount, category, date, brandName) => {
    const data = {
      party_rk: localStorage.getItem('party_rk'),
      brand_name: brandName,
      category: category,
      dttm: date,
      amt: amount
    };

    fetch('http://localhost:8000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(() => {
        Swal.fire({
          title: 'Успех!',
          text: 'Транзакция добавлена',
          icon: 'success',
          confirmButtonText: 'ОК',
          background: '#333',
          color: '#fff',
        }).then(() => window.location.reload());
      })
      .catch(err => {
        console.error('Ошибка при добавлении транзакции:', err);
        Swal.fire({
          title: 'Ошибка!',
          text: 'Не удалось добавить транзакцию',
          icon: 'error',
          confirmButtonText: 'ОК',
          background: '#333',
          color: '#fff',
        });
      });
  };

  const saveCategoryToBackend = (newCategoryName) => {
    const partyRk = localStorage.getItem('party_rk');
    const encodedCategory = encodeURIComponent(newCategoryName); // обязательно экранируем
  
    fetch(`http://localhost:8000/transactions/add-category?party_rk=${partyRk}&category=${encodedCategory}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(() => console.log('Категория успешно отправлена на сервер'))
      .catch(err => console.error('Ошибка при сохранении категории:', err));
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (category === 'new') {
      handleNewCategory();
    } else {
      sendTransactionToBackend(amount, category, date, brandName);
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

        if (shouldSave && !categories.includes(newCategoryName)) {
          setCategories((prevCategories) => [...prevCategories, newCategoryName]);
          saveCategoryToBackend(newCategoryName);
        }

        sendTransactionToBackend(amount, newCategoryName, date, brandName);
      }
    });
  };

  const handleCSVChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleCSVSubmit = (e) => {
    e.preventDefault();
    if (!csvFile) {
      Swal.fire({
        title: 'Ошибка!',
        text: 'Сначала выберите CSV файл',
        icon: 'error',
        background: '#333',
        color: '#fff',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    fetch('http://localhost:8000/transactions/csv?party_rk='+localStorage.getItem('party_rk').toString(), {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then((res) => {
        try{
          console.log(res.detail.status)
          if (res.detail.status === 'error'){
            Swal.fire({
              title: 'Ошибка!',
              text: 'Не удалось загрузить CSV файл',
              icon: 'error',
              confirmButtonText: 'ОК',
              background: '#333',
              color: '#fff',
            });}
            else{
              
            }
          }
          catch (error){
              Swal.fire({
                title: 'Успех!',
                text: 'Транзакции из файла добавлены',
                icon: 'success',
                confirmButtonText: 'ОК',
                background: '#333',
                color: '#fff',
              });
            }
      })
      .catch(err => {
        console.error('Ошибка при загрузке CSV:', err);
        Swal.fire({
          title: 'Ошибка!',
          text: 'Не удалось загрузить CSV файл',
          icon: 'error',
          confirmButtonText: 'ОК',
          background: '#333',
          color: '#fff',
        });
      });
  };

  return (
    <div>
      <Navigation />
      <form onSubmit={handleSubmit} id="addTr" className="form-container">
        <h2>Добавить транзакцию вручную</h2>

        <input
          type="text"
          placeholder="Название (необязательно)"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />

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
          <option value="new">Создать новую категорию</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
        />

        <button id='sbtn' className="submit" style={{ marginTop: '5px' }}>
          Добавить
        </button>

        <hr style={{ margin: '20px 0', borderColor: '#444' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h2 style={{ margin: 0 }}>Импорт из CSV</h2>
        <button
          type="button"
          onClick={() => {
            Swal.fire({
              title: 'Формат CSV-файла',
              html: `
                <p>Файл должен содержать следующие колонки:</p>
                <ul style="text-align: left;">
                  <li><b>brand_nm</b> — Название покупки</li>
                  <li><b>transaction_amt_rur</b> — Сумма покупки</li>
                  <li><b>loyalty_cashback_category_nm</b> — Категория</li>
                  <li><b>real_transaction_dttm</b> — Дата (в формате YYYY-MM-DD)</li>
                </ul>
              `,
              icon: 'info',
              confirmButtonText: 'ОК',
              background: '#333',
              color: '#fff',
            });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#0af',
            fontSize: '20px',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Информация о CSV"
          title="Информация о CSV"
        >
          ⓘ
        </button>
      </div>

        <input type="file" accept=".csv" onChange={handleCSVChange} />
        {csvFile && <p>Файл выбран: {csvFile.name}</p>}

        <button id="submCSV" onClick={handleCSVSubmit} className="submit" style={{ marginTop: '5px' }}>
          Добавить CSV
        </button>
      </form>
    </div>
  );
}
