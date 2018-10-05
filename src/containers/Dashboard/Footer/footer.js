/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Footer from '../../../components/Dashboard/Footer/footer';
import {
  startAppAction,
  setActiveAppAction,
  closeAppAction,
  reduceAppAction,
} from '../../../store/reducers/frameReducer';
import { logoutAction } from '../../../store/reducers/authReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({
  frameReducer,
  authReducer,
  notificationsReducer,
}) => ({
  applications: frameReducer.applications,
  activeApp: frameReducer.activeApp,
  loggedUser: authReducer.loginProcess.loggedUser,
  notifications: notificationsReducer.notifications,
});

// Actions
const mapDispatchToProps = dispatch => ({
  startAppAction: appId => {
    dispatch(startAppAction(appId));
  },
  closeAppAction: appId => {
    dispatch(closeAppAction(appId));
  },
  reduceAppAction: appId => {
    dispatch(reduceAppAction(appId));
  },
  setActiveAppAction: app => {
    dispatch(setActiveAppAction(app));
  },
  logoutAction: () => {
    dispatch(logoutAction());
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const FooterContainer = createContainer(Footer);
export default FooterContainer;
