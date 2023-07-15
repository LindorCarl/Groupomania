import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from "react-router-dom";
import "../src/index.css";
import { AuthContextProvider } from './components/store/AuthContext';
import router from "../src/components/router/Router";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
    
  </React.StrictMode>
);
