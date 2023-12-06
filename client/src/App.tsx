import React from 'react';
import './App.scss';
import Navbar from './components/navigation/Navbar';
import { Routing } from './Routing';
import { CookiesProvider, useCookies } from "react-cookie";

const App: React.FC = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  if (!cookies.user) {
    setCookie('user', {}, { path: '/' })
  }

  return (
    <CookiesProvider>
      <div className="App">
        <Navbar />
        <Routing />
      </div>
    </CookiesProvider>
  );
}

export default App;
