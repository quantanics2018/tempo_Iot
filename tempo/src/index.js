import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/style/App.css'
import ErrorBoundary from './ErrorBoundary';
import Alert_management_socket from './Alert_management_socket';


ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Alert_management_socket/>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
