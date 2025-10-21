import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './redux-state/store'
import { Provider } from 'react-redux'
import './styles/main.sass';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

