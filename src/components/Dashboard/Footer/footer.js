import React from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../../Applications/config/applicationsLoader';
import './footer.css';
import Thumbnail from '../../../containers/Dashboard/Footer/footerThumbnail';

class Footer extends React.Component {
  static propTypes = {
    startAppAction: PropTypes.func.isRequired,
    setActiveAppAction: PropTypes.func.isRequired,
    logoutAction: PropTypes.func.isRequired,
    applications: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };
  handleStartApp = event => {
    const { startAppAction, setActiveAppAction } = this.props;
    // Fetch appName from button toolbar clicked
    const { appname } = event.currentTarget.dataset;
    // Fetch appLoader class
    const appLoader = new AppLoader(appname);
    // See applicationLoader.js
    appLoader.applicationSelector().then(appComponent => {
      // Load for the first time the app
      startAppAction(appname);
      // See frameReducer
      setActiveAppAction({ appName: appname, appComponent });
    });
  };
  handleLogout = () => {
    const { logoutAction } = this.props;
    logoutAction();
  };
  render() {
    const { applications, loggedUser } = this.props;
    const objectValues = Object.keys(applications).map(
      itm => applications[itm],
    );
    return (
      <footer id="footer">
        <div className="footer-app-icon">
          {/* Loop over the applications and load icons */}
          {objectValues.map(application => {
            if (
              !application.typeUser.includes(loggedUser.typeUser) &&
              !application.typeUser.includes('all')
            ) {
              return '';
            }
            if (application.appName === 'Settings') {
              return '';
            }
            return (
              <button
                key={application.appName}
                data-appname={application.appName}
                onClick={this.handleStartApp}
                className="app-btn"
              >
                <div className="btn-container">
                  {[
                    <i
                      key={`${application.appName}-1`}
                      className={application.icon}
                      title={application.title}
                    />,
                    <span
                      key={`${application.appName}-2`}
                      className="btn-title"
                    >
                      {application.title}
                    </span>,
                  ]}
                </div>
                {applications[application.appName].reduce && (
                  <p className="active-app-circle" />
                )}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="btn-container">
            <button
              key="Settings"
              data-appname="Settings"
              onClick={this.handleStartApp}
              className="app-btn"
              title="Profile"
            >
              <Thumbnail />
            </button>
          </div>
          <div className="btn-container">
            <button
              className="app-btn logout"
              onClick={this.handleLogout}
              title="Logout"
            >
              <i className="fas fa-power-off fa-2x" />
            </button>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
