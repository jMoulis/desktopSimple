import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import './app.css';
import Dashboard from '../../containers/Dashboard/dashboard';
import Footer from '../../containers/Dashboard/Footer/footer';
import Home from '../../containers/Home/home';
import LoginForm from '../../containers/Home/Login/login';
import Content from '../../containers/Home/Content/content';
import NoMatch from '../NoMatch/noMatch';
import Signup from '../../containers/User/SignUp/signup';


class App extends Component {
  static propTypes = {
    auth: PropTypes.bool.isRequired,
    rehydrateAction: PropTypes.func.isRequired,
  }
  componentDidMount() {
    // Refresh Management
    // if token and if auth true
    // rehydrate auth and user
    const { rehydrateAction, auth } = this.props;
    if (!auth) {
      if (localStorage.getItem('token')) {
        rehydrateAction();
      }
    }
  }
  render() {
    const { auth } = this.props;
    return (
      <div id="app">
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              if (auth) return <Redirect to="/dashboard" />;
              return <Home><Content /></Home>;
            }}
          />
          <Route
            exact
            path="/signin"
            render={() => {
              if (auth) {
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
            path="/signup"
            render={() => {
              if (auth) {
                return <Redirect to="/dashboard" />;
              }
              return (
                <Home>
                  <Signup />
                </Home>
                );
            }}
          />
          <Route
            exact
            path="/dashboard"
            render={() => {
              if (auth) {
                return [<Dashboard key="dashboard" />, <Footer key="footer" />];
              }
              return <Redirect to="/" />;
            }}
          />
          <Route
            render={() => (
              <Home>
                <NoMatch />
              </Home>
              )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
