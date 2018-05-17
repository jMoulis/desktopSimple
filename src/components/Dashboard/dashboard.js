import React from 'react';
import PropTypes from 'prop-types';

import './dashboard.css';
import Frame from '../../containers/Dashboard/Frame/frame';
import Helper from '../../containers/Dashboard/Helper/helper';

class Dashboard extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    activeApps: PropTypes.array,
  }
  static defaultProps = {
    activeApps: null,
  }
  state = {
    helper: true,
  }
  handleCloseHelper = () => {
    this.setState(prevState => ({
      ...prevState,
      helper: false,
    }));
    return true;
  }
  render() {
    const { applications, activeApps, loggedUser } = this.props;
    const objectValues = Object.keys(applications).map(itm => applications[itm]);
    return (
      <main id="dashboard">
        {objectValues.map((application) => {
          if (application.display) {
            return (
              <Frame
                key={application.appName}
                appName={application.appName}
                title={application.title}
              >
                {activeApps.length !== 0 && activeApps.map((activeApp) => {
                  if (activeApp.appName === application.appName) {
                    return React.createElement(
                      activeApp.appComponent,
                      { key: activeApp, loggedUser },
                    );
                  }
                  return '';
                })}
              </Frame>
            );
          }
          return false;
        })}
        {this.state.helper &&
          loggedUser.user.teams.length === 0 &&
          <Helper
            show={this.state.helper}
            close={this.handleCloseHelper}
          />}
      </main>
    );
  }
}

export default Dashboard;
