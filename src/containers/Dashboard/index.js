/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Dashboard from '../../components/Dashboard';
import {
  setActiveAppAction,
  startAppAction,
} from '../../store/reducers/frameReducer';
import { showUserDetailModalAction } from '../../store/reducers/appReducer';
import AppLoader from '../../components/Applications/config/applicationsLoader';
import { editTeamAction } from '../../store/reducers/teamReducer';
import {
  createMessageAction,
  fetchMessagesAction,
  createMessageSuccessAction,
  fetchMessagesSuccessAction,
} from '../../store/reducers/chatReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({
  frameReducer,
  authReducer,
  mainTeamReducer,
  appReducer,
}) => ({
  activeApp: frameReducer.activeApp,
  applications: frameReducer.applications,
  activeApps: frameReducer.activeApps,
  globalProps: {
    activeTeamProcess: mainTeamReducer.activeTeamProcess,
  },
  loggedUser: {
    user: authReducer.loginProcess.loggedUser,
    auth: authReducer.auth,
  },
  showUserDetailModal: appReducer.showUserDetailModal,
});

// Actions
const mapDispatchToProps = dispatch => ({
  setActiveAppAction: app => {
    dispatch(setActiveAppAction(app));
  },
  // Actions passes to all components mainly
  // to open applications from other applications
  // They are passed to main applications components
  globalActions: {
    startAppAction: app => {
      const appLoader = new AppLoader(app);
      appLoader.applicationSelector().then(appComponent => {
        dispatch(startAppAction(app));
        dispatch(setActiveAppAction({ appName: app, appComponent }));
      });
    },
    editTeamAction: values => {
      dispatch(editTeamAction(values));
    },
  },
  showUserDetailModalAction: user => {
    dispatch(showUserDetailModalAction(user));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const DashboardContainer = createContainer(Dashboard);
export default DashboardContainer;
