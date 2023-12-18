import React from 'react';
import './App.scss';
import Navbar from './components/navigation/Navbar';
import { Routing } from './Routing';

const App: React.FC = () => {


  return (
    <div className="App">
      <Navbar />
      <Routing />
    </div>
  );
}

export default App;
