import React from 'react';
import PropTypes from 'prop-types';

import './dashboard.css';
import Frame from '../../containers/Dashboard/Frame/frame';
import Helper from '../../containers/Dashboard/Helper/helper';
import TeamToolbar from '../../containers/Dashboard/TeamToolbar';
import Modal from '../../Modules/Modal/modal';
import TeamSettings from '../../containers/Dashboard/TeamSettings';
import DetailUser from '../../containers/User/Detail';

class Dashboard extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    activeTeamProcess: PropTypes.object.isRequired,
    showSelectTeamPanel: PropTypes.func.isRequired,
    showUserDetailModalAction: PropTypes.func.isRequired,
    showUserDetailModal: PropTypes.bool.isRequired,
    activeApps: PropTypes.array,
  }
  static defaultProps = {
    activeApps: null,
  }
  state = {
    helper: true,
    showSettings: false,
  }
  handleShowSettings = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings,
    }));
  }
  handleCloseHelper = () => {
    this.setState(prevState => ({
      ...prevState,
      helper: false,
    }));
    return true;
  }
  render() {
    const {
      applications,
      activeApps,
      loggedUser,
      activeTeamProcess,
      showSelectTeamPanel,
      showUserDetailModalAction,
      showUserDetailModal,
    } = this.props;
    const objectValues = Object.keys(applications).map(item => applications[item]);
    return (
      <main id="dashboard">
        {activeTeamProcess.loading === false &&
          loggedUser.typeUser !== 'company' &&
            <TeamToolbar
              showSettings={this.handleShowSettings}
              showSelectTeamPanel={showSelectTeamPanel}
            />
        }
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
          loggedUser.user.typeUser === 'student' &&
          <Helper
            show={this.state.helper}
            close={this.handleCloseHelper}
          />}
        {this.state.showSettings &&
          <Modal
            zIndex={4000}
            name="Settings"
            title="Settings"
            closeFromParent={this.handleShowSettings}
          >
            <TeamSettings />
          </Modal>
        }
        {showUserDetailModal &&
          <Modal
            title="User"
            closeFromParent={showUserDetailModalAction}
            name="User Detail"
            zIndex={200}
            small
          >
            <DetailUser />
          </Modal>
        }
      </main>
    );
  }
}

export default Dashboard;
