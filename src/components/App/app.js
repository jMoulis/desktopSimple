import React, { Component } from 'react';
import './app.css';
import Dashboard from '../../containers/Dashboard/dashboard';
import Footer from '../../containers/Dashboard/Footer/footer';

class App extends Component {
  render() {
    return (
      <div id="app">
        <Dashboard />
        <Footer />
      </div>
    );
  }
}

export default App;
