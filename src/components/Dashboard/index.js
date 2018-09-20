import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import './dashboard.css';
import Frame from '../../containers/Dashboard/Frame/frame';
import Helper from '../../containers/Dashboard/Helper/helper';
import TeamToolbar from '../../containers/Dashboard/TeamToolbar';
import Modal from '../../Modules/Modal/modal';
import TeamSettings from '../../containers/Dashboard/TeamSettings';
import DetailUser from '../../containers/User/Detail';
import { ROOT_URL } from '../../Utils/config';
import ChatBox from './ChatBox';

class Dashboard extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    globalProps: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    showSelectTeamPanel: PropTypes.func.isRequired,
    showUserDetailModalAction: PropTypes.func.isRequired,
    showUserDetailModal: PropTypes.bool.isRequired,
    selectTeam: PropTypes.func.isRequired,
    activeApps: PropTypes.array,
  };
  static defaultProps = {
    activeApps: null,
  };

  constructor(props) {
    super(props);
    this.socket = io(`${ROOT_URL}`);
    this.socket.on('connect', () => {
      console.log('Connected');
    });
    this.state = {
      helper: true,
      showSettings: false,
      activeChats: {},
    };
  }

  handleShowSettings = () => {
    this.setState(prevState => ({
      showSettings: !prevState.showSettings,
    }));
  };

  handleCloseHelper = () => {
    this.setState(prevState => ({
      ...prevState,
      helper: false,
    }));
    return true;
  };

  render() {
    const {
      applications,
      activeApps,
      loggedUser,
      globalProps,
      showSelectTeamPanel,
      showUserDetailModalAction,
      showUserDetailModal,
      globalActions,
      selectTeam,
    } = this.props;
    const objectValues = Object.keys(applications).map(
      item => applications[item],
    );
    const { user } = loggedUser;
    return (
      <main id="dashboard" className="dashboard">
        {globalProps.activeTeamProcess.team &&
          user.typeUser !== 'company' && (
            <TeamToolbar
              showSettings={this.handleShowSettings}
              showSelectTeamPanel={showSelectTeamPanel}
              globalActions={globalActions}
            />
          )}
        {objectValues.map(application => {
          if (application.display) {
            return (
              <Frame
                key={application.appName}
                appName={application.appName}
                title={application.title}
              >
                {activeApps.length !== 0 &&
                  activeApps.map(activeApp => {
                    if (activeApp.appName === application.appName) {
                      return React.createElement(activeApp.appComponent, {
                        key: activeApp,
                        loggedUser: user,
                        globalActions: {
                          ...globalActions,
                          selectTeam,
                        },
                        globalProps: {
                          ...globalProps,
                          socketIo: this.socket,
                        },
                      });
                    }
                    return null;
                  })}
              </Frame>
            );
          }
          return false;
        })}
        {this.state.helper &&
          user &&
          user.teams &&
          user.teams.length === 0 &&
          user.typeUser === 'student' && (
            <Helper show={this.state.helper} close={this.handleCloseHelper} />
          )}
        {this.state.showSettings && (
          <Modal
            zIndex={100}
            name="Settings"
            title="Settings"
            closeFromParent={this.handleShowSettings}
          >
            <TeamSettings globalActions={globalActions} />
          </Modal>
        )}
        {showUserDetailModal && (
          <Modal
            title="User"
            closeFromParent={showUserDetailModalAction}
            name=""
            zIndex={200}
            small
          >
            <DetailUser />
          </Modal>
        )}
        <ChatBox user={user} socket={this.socket} />
      </main>
    );
  }
}

export default Dashboard;
