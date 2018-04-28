/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Footer from '../../../components/Dashboard/Footer/footer';
import { startAppAction, setActiveAppAction } from '../../../store/reducers/frameReducer';
import { logoutAction } from '../../../store/reducers/authReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ frameReducer }) => ({
  applications: frameReducer.applications,
  activeApp: frameReducer.activeApp,
});

// Actions
const mapDispatchToProps = dispatch => ({
  startAppAction: (appId) => {
    dispatch(startAppAction(appId));
  },
  setActiveAppAction: (app) => {
    dispatch(setActiveAppAction(app));
  },
  logoutAction: () => {
    dispatch(logoutAction());
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const FooterContainer = createContainer(Footer);
export default FooterContainer;
