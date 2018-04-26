import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './app.css';
import Dashboard from '../../containers/Dashboard/dashboard';
import Footer from '../../containers/Dashboard/Footer/footer';
import Home from '../../containers/Home/home';
import Unauthorized from '../Unauthorized/unauthorized';
import LoginForm from '../../containers/Home/Login/login';
import Content from '../../containers/Home/Content/content';
import NoMatch from '../NoMatch/noMatch';

class App extends Component {
  handleNaze = () => {
    // Ferme là
  }
  render() {
    const { loginProcess } = this.props;
    return (
      <div id="app">
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <Home>
                  <Content />
                </Home>
                );
            }}
          />
          <Route
            exact
            path="/signin"
            render={() => {
              if (loginProcess.auth) {
                return <Redirect to="/dashboard" />;
              }
              return (
                <Home>
                  <LoginForm />
                </Home>
                );
            }}
          />
          <Route
            exact
            path="/dashboard"
            render={() => {
              if (loginProcess.auth) {
                return [<Dashboard key="dashboard" />, <Footer key="footer" />];
              }
              return <Unauthorized />;
            }}
          />
          <Route
            render={() => {
              return (
                <Home>
                  <NoMatch />
                </Home>
                );
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
