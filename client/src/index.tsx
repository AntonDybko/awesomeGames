import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.scss';
import App from './App';
import { AuthProvider } from 'context/AuthProvider';
import { DialogProvider } from 'context/DialogProvider';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') disableReactDevTools();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <AuthProvider>
      <BrowserRouter>
        <DialogProvider>
          <App />
        </DialogProvider>
      </BrowserRouter>
    </AuthProvider>
);

