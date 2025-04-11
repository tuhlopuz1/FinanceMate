import React from 'react';
import { Link } from 'react-router-dom';
import './components/Styles.css';
function Home() {
  return (
    <div>
      <h2 id="name">FinanceMate</h2>
      <div id="authButtons">
        <Link to="/sign-up"><button id="signUpButton" className="homeButtons"><b>Регистрация</b></button></Link>
        <Link to="/log-in"><button className="homeButtons"><b>Вход</b></button></Link>
      </div>
      <br></br>
      <div id="brief">
        <h1>Управляйте своими финансами эффективно</h1>
        <div id="desc">
          <p>Анализируйте свои расходы с помощью интерактивных графиков, легко отслеживайте транзакции и получайте персонализированные финансовые советы.</p>
        </div>
        <Link to="/sign-up"><button id="getStarted" className="homeButtons"><b>Начать сейчас</b></button></Link>
      </div>
    </div>
  );
}

export default Home;