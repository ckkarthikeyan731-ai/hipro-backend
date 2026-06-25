import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// This is the core engine that renders your entire project into the index.html file
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);