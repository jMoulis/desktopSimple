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
    activeApp: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
  }
  handleStartApp = (event) => {
    const {
      startAppAction,
      setActiveAppAction,
    } = this.props;
    // Fetch appName from button toolbar clicked
    const { appname } = event.currentTarget.dataset;
    // Fetch appLoader class
    const appLoader = new AppLoader(appname);
    // See applicationLoader.js
    appLoader.applicationSelector()
      .then((appComponent) => {
        // Load for the first time the app
        startAppAction(appname);
        // See frameReducer
        setActiveAppAction({ appName: appname, appComponent });
      });
  }
  handleLogout = () => {
    const { logoutAction } = this.props;
    logoutAction();
  }
  render() {
    const { applications, activeApp, loggedUser } = this.props;
    const objectValues = Object.keys(applications).map(itm => applications[itm]);
    return (
      <footer id="footer">
        <div className="footer-app-icon">
          {/* Loop over the applications and load icons */}
          {objectValues.map((application) => {
            if (!application.typeUser.includes(loggedUser.typeUser) && !application.typeUser.includes('all')) {
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
                    application.appName === 'Settings' ? <Thumbnail /> :
                    [
                      <i key={`${application.appName}-1`} className={application.icon} />,
                      <span key={`${application.appName}-2`} className="btn-title">{application.title}</span>,
                    ]
                  }
                  {applications[activeApp.appName] && applications[activeApp.appName].reduce && <span className="active-app-circle" />}
                </div>
              </button>
            );
          })}
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
