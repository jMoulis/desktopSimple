import React from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../../Applications/config/applicationsLoader';
import './footer.css';

class Footer extends React.Component {
  static propTypes = {
    startAppAction: PropTypes.func.isRequired,
    setActiveAppAction: PropTypes.func.isRequired,
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
  render() {
    const { applications } = this.props;
    return (
      <footer id="footer">
        {Object.values(applications).map(application => (
          <button
            key={application.appName}
            data-appname={application.appName}
            onClick={this.handleStartApp}
          >
            <div className="btn-container">
              <i className={application.icon} />
              <span className="btn-title">{application.title}</span>
            </div>
          </button>
        ))}
      </footer>
    );
  }
}

export default Footer;
