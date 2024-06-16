import React, { useEffect, useState } from 'react';
import './App.scss';
import Navbar from './components/navigation/Navbar';
import { Routing } from './Routing';
import { io, Socket } from 'socket.io-client';
import useAuth from 'hooks/useAuth';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { auth } = useAuth();

  useEffect(() => {
    if(auth?.token){
      const newSocket = io("http://localhost:5000", {
        extraHeaders: {
          Authorization: `Bearer ${auth.token}`,}
      });

      setSocket(newSocket);

      return () => {
        if(auth.token){
          newSocket.close()
        }
      }
    }

    return () => {}
  }, [auth])

  return (
    <div className="App">
      <Navbar />
      <Routing socket={socket}/>
    </div>
  );
}

export default App;
