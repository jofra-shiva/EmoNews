import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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

function App() {
  const [mode] = useState(false);

  return (
    <Router>
      <div className="App">
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
