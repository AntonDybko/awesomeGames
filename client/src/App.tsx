import React from 'react';
import './App.scss';
import { Routes, Route } from "react-router-dom";
import Layout from 'routes/Layout';
import Home from 'routes/Home';
import Games from 'routes/Games';
import Ranking from 'routes/Ranking';
import NoMatch from 'routes/NoMatch';
import Profile from 'routes/Profile';

function App() {
  return (
    <div className="App">
      <h2>Project Template</h2>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="games/*" element={<Games />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
