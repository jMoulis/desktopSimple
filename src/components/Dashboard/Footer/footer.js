import React from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../../Applications/config/applicationsLoader';
import './footer.css';

class Footer extends React.Component {
  static propTypes = {
    startAppAction: PropTypes.func.isRequired,
    setActiveAppAction: PropTypes.func.isRequired,
    logoutAction: PropTypes.func.isRequired,
    applications: PropTypes.object.isRequired,
  }
  handleStartApp = (event) => {
    const { startAppAction, setActiveAppAction } = this.props;
    const { appname } = event.currentTarget.dataset;
    const appLoader = new AppLoader(appname);
    appLoader.applicationSelector()
      .then((appComponent) => {
        startAppAction(appname);
        setActiveAppAction({ appName: appname, appComponent });
      });
  }
  handleLogout = () => {
    const { logoutAction } = this.props;
    logoutAction();
  }
  render() {
    const { applications } = this.props;
    return (
      <footer id="footer">
        <div className="footer-app-icon">
          {Object.values(applications).map(application => (
            <button
              key={application.appName}
              data-appname={application.appName}
              onClick={this.handleStartApp}
              className="app-btn"
            >
              <div className="btn-container">
                <i className={application.icon} />
                <span className="btn-title">{application.title}</span>
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
