import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useLocation } from "react-router-dom";
import { loadModels } from './helpers/faceApi';
import { createFaLibrary } from './helpers/icons';
import Camera from './components/Camera/Camera';
import Cameratamil from './components/Cameratamil/Cameratamil';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

createFaLibrary();
loadModels();

const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';
  
  if (isAuthPage) return null;

  return (
    <nav className='App__header'>
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <h1>EMONews AI <span className="author-tag">BY SHIVA</span></h1>
      </Link>
      <div className="App__nav-group">
        <div className="App__switcher">
          <Link className={`App__switcher-Link ${location.pathname === '/dashboard' ? 'active' : ''}`} to='/dashboard'>English</Link>
          <Link className={`App__switcher-Link ${location.pathname === '/tamil' ? 'active' : ''}`} to='/tamil'>Tamil</Link>
        </div>
        <button 
          className="App__logout-btn" 
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            window.location.href = "/";
          }}
        >
          <span role="img" aria-label="logout">🚪</span> Logout
        </button>
      </div>
    </nav>
  );
};

function App() {
  const [mode] = useState(false);

  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <ProtectedRoute path="/dashboard" component={() => <Camera photoMode={mode} />} />
          <ProtectedRoute path='/tamil' component={() => <Cameratamil photoMode={mode} />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
