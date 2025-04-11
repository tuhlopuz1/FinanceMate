import React from 'react';
import { Link } from 'react-router-dom';
import './components/Styles.css';
function Home() {
  return (
    <div>
      <h2 id="name">ChatAI</h2>
      <div id="authButtons">
        <Link to="/sign-up"><button id="signUpButton" className="homeButtons"><b>Sign up</b></button></Link>
        <Link to="/log-in"><button className="homeButtons"><b>Log in</b></button></Link>
      </div>
      <br></br>
      <div id="brief">
        <h1>Track Your Finances Smarter</h1>
        <div id="desc">
          <p>Visualize your spending with interactive charts, manage transactions easily, and get financial insights tailored to you. Stay in control with a sleek, dark-themed interface built for clarity and speed.</p>
        </div>
        <Link to="/sign-up"><button id="getStarted" className="homeButtons"><b>Get started</b></button></Link>
      </div>
    </div>
  );
}

export default Home;