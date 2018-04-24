import React from 'react';
import PropTypes from 'prop-types';

import './footer.css';

class Footer extends React.Component {
  static propTypes = {
    startAppAction: PropTypes.func.isRequired,
    setActiveAppAction: PropTypes.func.isRequired,
    applications: PropTypes.object.isRequired,
  }
  handleStartApp = (event) => {
    const { startAppAction, setActiveAppAction } = this.props;
    const { app } = event.target.dataset;
    startAppAction(app);
    setActiveAppAction(app);
  }
  render() {
    const { applications } = this.props;
    return (
      <footer id="footer">
        {Object.values(applications).map(application => (
          <button
            key={application.appName}
            data-app={application.appName}
            onClick={this.handleStartApp}
          >
            {application.title}
          </button>
        ))}
      </footer>
    );
  }
}

export default Footer;
