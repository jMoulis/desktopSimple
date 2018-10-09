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
import ErrorBoundary from '../Hoc/ErrorBoundary';

const ROOT_URL = process.env.REACT_APP_API;

class Dashboard extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    globalProps: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    showSelectTeamPanel: PropTypes.func.isRequired,
    showUserDetailModalAction: PropTypes.func.isRequired,
    fetchNotificationsSuccessAction: PropTypes.func.isRequired,
    newRoomMessageSuccessAction: PropTypes.func.isRequired,
    fetchNotificationsAction: PropTypes.func.isRequired,
    setConnectedUsersAction: PropTypes.func.isRequired,
    showUserDetailModal: PropTypes.bool.isRequired,
    selectTeam: PropTypes.func.isRequired,
    activeApps: PropTypes.array,
  };
  static defaultProps = {
    activeApps: null,
  };

  constructor(props) {
    super(props);
    this.socket = io(`${ROOT_URL}`, {
      multiplex: false,
      query: {
        userId: props.loggedUser.user._id,
      },
    });
    this.socket.on('connect', () => {});
    this.socket.on('reconnect', () => this.handleStatusSocket('reconnect'));
    this.socket.on('CONNECT_SUCCESS', ({ connectedUsers }) => {
      props.setConnectedUsersAction(connectedUsers);
    });
    this.socket.on('START_PRIVATE_CHAT', () => {});
    this.socket.on('NEW_NOTIFICATION_SUCCESS', ({ notifications }) => {
      props.fetchNotificationsSuccessAction({ notifications });
    });
    this.socket.on('NEW_ROOM_MESSAGE_SUCCESS', ({ room, message }) => {
      props.newRoomMessageSuccessAction({ room, message });
    });
    this.state = {
      helper: true,
      showSettings: false,
      status: null,
    };
  }

  componentDidMount() {
    const { fetchNotificationsAction } = this.props;
    fetchNotificationsAction();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleStatusSocket = status => {
    this.setState(() => ({
      status,
    }));
  };

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
                        key: activeApp.appName,
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
          >
            <DetailUser socket={this.socket} loggedUser={loggedUser} />
          </Modal>
        )}
      </main>
    );
  }
}

export default Dashboard;
