import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './app.css';
import Dashboard from '../../containers/Dashboard/dashboard';
import Footer from '../../containers/Dashboard/Footer/footer';
import Home from '../../containers/Home/home';

class App extends Component {
  handleNaze = () => {
    // Ferme là
  }
  render() {
    return (
      <div id="app">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/dashboard"
            render={() => [<Dashboard />, <Footer />]}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
