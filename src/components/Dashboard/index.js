import React from 'react';
import PropTypes from 'prop-types';

import './dashboard.css';
import Frame from '../../Modules/Frame/containers/frame';
import Helper from '../../containers/Dashboard/Helper/helper';
// import TeamToolbar from '../../containers/Dashboard/TeamToolbar';
import Modal from '../../Modules/Modal/modal';
import TeamSettings from '../../containers/Dashboard/TeamSettings';
import DetailUser from '../../containers/User/Detail';
import { withAuth } from '../../Modules/Auth/AuthProvider';

class Dashboard extends React.Component {
  static propTypes = {
    applications: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    globalProps: PropTypes.object.isRequired,
    globalActions: PropTypes.object.isRequired,
    socketProvider: PropTypes.object.isRequired,
    // showSelectTeamPanel: PropTypes.func,
    showUserDetailModalAction: PropTypes.func.isRequired,
    fetchNotificationsSuccessAction: PropTypes.func.isRequired,
    fetchNotificationsAction: PropTypes.func.isRequired,
    setConnectedUsersAction: PropTypes.func.isRequired,
    showUserDetailModal: PropTypes.bool.isRequired,
    selectTeam: PropTypes.func.isRequired,
    activeApps: PropTypes.array,
  };
  static defaultProps = {
    activeApps: null,
    // showSelectTeamPanel: null,
  };

  constructor(props) {
    super(props);
    const {
      socketProvider: { socket, socketActions },
    } = props;

    this.socket = socket;
    this.state = {
      helper: true,
      showSettings: false,
      socketStatus: {
        type: null,
        message: null,
        error: {
          reconnecting: {
            status: false,
            message: '',
          },
        },
      },
    };
    socketActions.onNotificationSuccess(props.fetchNotificationsSuccessAction);
    // this.socket.on('NEW_NOTIFICATION_SUCCESS', ({ notifications }) => {
    //   props.fetchNotificationsSuccessAction({ notifications });
    // });
    socketActions.onConnectSuccess(
      this.props.setConnectedUsersAction,
      this.props.fetchNotificationsSuccessAction,
    );
  }

  componentDidMount() {
    const { fetchNotificationsAction } = this.props;
    fetchNotificationsAction();
  }
  componentWillUnmount() {
    this.socket.close();
  }

  handleStatusSocket = socketStatus => {
    this.setState(() => ({
      socketStatus,
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
      showUserDetailModalAction,
      showUserDetailModal,
      globalActions,
      selectTeam,
    } = this.props;
    const objectValues = Object.keys(applications).map(
      item => applications[item],
    );
    const { user } = loggedUser;
    const { socketStatus } = this.state;
    return (
      <main id="dashboard" className="dashboard">
        {/* globalProps.activeTeamProcess.team &&
          user.typeUser !== 'company' && (
            <TeamToolbar
              showSettings={this.handleShowSettings}
              showSelectTeamPanel={showSelectTeamPanel}
              globalActions={globalActions}
            />
          ) */}
        {/* {status.type === 'error' && <Notifications message={status.message} />} */}
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
                          socketIo: this.props.socketProvider.socket,
                          loggedUser: user,
                          socketStatus,
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
