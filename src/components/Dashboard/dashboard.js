import React from 'react';
import PropTypes from 'prop-types';
import './dashboard.css';
import Frame from '../../containers/Dashboard/Frame/frame';


class Dashboard extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
  }
  handleTartuff = () => {
  }
  render() {
    const { applications } = this.props;
    return (
      <main id="dashboard">
        {Object.values(applications).map((application) => {
          if (application.display) {
            return (
              <Frame
                key={application.appName}
                appName={application.appName}
                title={application.title}
              />
            );
          }
          return false;
        })}
      </main>
    );
  }
}

export default Dashboard;
