import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import SignUp from './SignUp';
import LogIn from './LogIn';
import Main from './Main';
import AddTransaction from './addTransaction';
import FinanceHelper from './financeHelper';
 



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/add-transaction" element={<AddTransaction />} />
        <Route path="/finance-helper" element={<FinanceHelper />} />
      </Routes>
    </Router>
  );
}

export default App;