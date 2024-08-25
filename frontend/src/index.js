import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change here
import './index.css';
import App from './App';

// Create a root using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Use the root to render your app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
