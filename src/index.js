import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './containers/App/app';
import registerServiceWorker from './registerServiceWorker';
import store from './store/index';
import './styles/main.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
