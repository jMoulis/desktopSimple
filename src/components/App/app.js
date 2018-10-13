import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import './app.css';
import Dashboard from '../../containers/Dashboard';
import Footer from '../../containers/Dashboard/Footer/footer';
import Home from '../../containers/Home/home';
import LoginForm from '../../containers/Home/Login/login';
import Content from '../../containers/Home/Content/content';
import NoMatch from '../NoMatch/noMatch';
import Signup from '../../containers/Home/SignUp';
import TeamSelector from '../../containers/Dashboard/TeamSelector';
import Loader from '../../Modules/Loader';
import ErrorBoundary from '../Hoc/ErrorBoundary';

class App extends Component {
  static propTypes = {
    auth: PropTypes.bool.isRequired,
    rehydrateAction: PropTypes.func.isRequired,
    fetchSingleTeamAction: PropTypes.func.isRequired,
    loginProcess: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showSelectTeam: true,
    };
  }
  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.auth === false) {
      return {
        showSelectTeam: true,
      };
    }
    return nextState;
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
  handleSelectTeam = teamid => {
    const { fetchSingleTeamAction } = this.props;
    this.setState(() => ({
      showSelectTeam: false,
    }));
    fetchSingleTeamAction(teamid);
  };
  showSelectTeamPanel = () => {
    this.setState(() => ({
      showSelectTeam: true,
    }));
  };
  render() {
    const { auth, loginProcess } = this.props;
    return (
      <div id="app">
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              if (auth) return <Redirect to="/dashboard" />;
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
                return (
                  <div className="app-container">
                    <ErrorBoundary>
                      <Dashboard
                        key="dashboard"
                        // showSelectTeamPanel={this.showSelectTeamPanel}
                        selectTeam={this.handleSelectTeam}
                      />

                      {/* {this.state.showSelectTeam &&
                        loginProcess.loggedUser.typeUser !== 'company' &&
                        loginProcess.loggedUser.teams.length !== 0 && (
                          <TeamSelector selectTeam={this.handleSelectTeam} />
                        )} */}
                    </ErrorBoundary>
                    <Footer key="footer" />
                  </div>
                );
              } else if (loginProcess.loading) {
                return (
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: '#41848f',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Loader />
                  </div>
                );
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
