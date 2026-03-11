import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { loadModels } from './helpers/faceApi';
import { createFaLibrary } from './helpers/icons';
import Camera from './components/Camera/Camera';
import './App.css';
import Cameratamil from './components/Cameratamil/Cameratamil';

createFaLibrary();
loadModels();

function App() {
  const [mode] = useState(false);
  // const [mode, setMode] = useState(false); 

  return (
    <Router>
      <div className="App">


        <Switch>
          <Route exact path="/" component={() => <Camera photoMode={mode} />} />
          <Route path="/dashboard" component={() => <Camera photoMode={mode} />} />
          <Route path='/tamil' component={() => <Cameratamil photoMode={mode} />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
