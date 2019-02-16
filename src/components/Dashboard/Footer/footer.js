import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../../Applications/config/applicationsLoader';
import './footer.css';
import BadgeNotifications from './BadgeNotifications';
import UserIconContainer from '../../../Modules/UserIcon';
import { withAuth } from '../../../Modules/Auth/AuthProvider';

class Footer extends React.Component {
  static propTypes = {
    startAppAction: PropTypes.func.isRequired,
    setActiveAppAction: PropTypes.func.isRequired,
    logoutAction: PropTypes.func.isRequired,
    applications: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    notifications: PropTypes.array.isRequired,
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

  isConnected = (user, connectedUsers) => {
    const userConnected = connectedUsers.some(
      connectedUser => connectedUser._id === user._id,
    );
    return userConnected;
  };

  hasNotifications = (notifications, appNotificationKey) => {
    const totalNotifications = notifications.filter(
      notification =>
        notification.type === appNotificationKey && !notification.isRead,
    ).length;
    if (totalNotifications > 0)
      return <BadgeNotifications count={totalNotifications} />;
    return null;
  };

  render() {
    const { applications, loggedUser, notifications } = this.props;
    console.log(this.props);
    const objectValues = Object.keys(applications).map(
      item => applications[item],
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
                  {
                    <Fragment>
                      {this.hasNotifications(
                        notifications,
                        application.notificationsKey,
                      )}
                      <i
                        key={`${application.appName}-1`}
                        className={application.icon}
                        title={application.title}
                      />
                      <span
                        key={`${application.appName}-2`}
                        className="btn-title"
                      >
                        {application.title}
                      </span>
                    </Fragment>
                  }
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
              style={{
                padding: 0,
              }}
              title="Profile"
            >
              <UserIconContainer
                user={{ user: loggedUser }}
                active={false}
                classCss="middle"
              />
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
