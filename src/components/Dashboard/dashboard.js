import React from 'react';
import PropTypes from 'prop-types';
import './dashboard.css';
import Frame from '../../containers/Dashboard/Frame/frame';


class Dashboard extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
    activeApps: PropTypes.array,
  }
  static defaultProps = {
    activeApps: null,
  }
  render() {
    const { applications, activeApps } = this.props;
    return (
      <main id="dashboard">
        {Object.values(applications).map((application) => {
          if (application.display) {
            return (
              <Frame
                key={application.appName}
                appName={application.appName}
                title={application.title}
              >
                {activeApps.length !== 0 && activeApps.map((activeApp) => {
                  if (activeApp.appName === application.appName) {
                    return React.createElement(activeApp.appComponent, { key: activeApp });
                  }
                  return '';
                })}
              </Frame>
            );
          }
          return false;
        })}
      </main>
    );
  }
}

export default Dashboard;
