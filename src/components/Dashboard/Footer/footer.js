import React from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../../Applications/config/applicationsLoader';
import './footer.css';
import Thumbnail from '../../Applications/Settings/containers/Profile/Thumbnail/thumbnail';

class Footer extends React.Component {
  static propTypes = {
    startAppAction: PropTypes.func.isRequired,
    setActiveAppAction: PropTypes.func.isRequired,
    reduceAppAction: PropTypes.func.isRequired,
    logoutAction: PropTypes.func.isRequired,
    closeAppAction: PropTypes.func.isRequired,
    applications: PropTypes.object.isRequired,
    activeApp: PropTypes.object.isRequired,
  }
  handleStartApp = (event) => {
    const {
      startAppAction,
      setActiveAppAction,
      closeAppAction,
      applications,
      reduceAppAction,
    } = this.props;
    // Fetch appName from button toolbar clicked
    const { appname } = event.currentTarget.dataset;
    // Fetch appLoader class
    const appLoader = new AppLoader(appname);
    // See applicationLoader.js
    if (!applications[appname].display) {
      appLoader.applicationSelector()
        .then((appComponent) => {
          // Load for the first time the app
          startAppAction(appname);
          // See frameReducer
          setActiveAppAction({ appName: appname, appComponent });
        });
    }
    else if (applications[appname].reduce) {
      reduceAppAction(appname);
    }
    else {
      closeAppAction(appname);
    }
  }
  handleLogout = () => {
    const { logoutAction } = this.props;
    logoutAction();
  }
  render() {
    const { applications, activeApp } = this.props;
    return (
      <footer id="footer">
        <div className="footer-app-icon">
          {/* Loop over the applications and load icons */}
          {Object.values(applications).map(application => (
            <button
              key={application.appName}
              data-appname={application.appName}
              onClick={this.handleStartApp}
              className="app-btn"
            >
              <div className="btn-container">
                {
                  application.appName === 'Settings' ? <Thumbnail /> :
                  [
                    <i className={application.icon} />,
                    <span className="btn-title">{application.title}</span>,
                  ]
                }
                {applications[activeApp.appName] && applications[activeApp.appName].reduce && <span className="active-app-circle" />}
              </div>
            </button>
          ))}
        </div>
        <div className="btn-container">
          <button className="app-btn logout" onClick={this.handleLogout}>
            <i className="fas fa-sign-out-alt" />
          </button>
        </div>
      </footer>
    );
  }
}

export default Footer;
