import React from 'react';
import { Link } from 'react-router-dom';

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
        <h1>Chat with Multiple AI Models</h1>
        <div id="desc">
          <p>Create personalized conversations with different AI language models. Customize your experience and get the answers you need.</p>
        </div>
        <Link to="/sign-up"><button id="getStarted" className="homeButtons"><b>Get started</b></button></Link>
      </div>
    </div>
  );
}

export default Home;