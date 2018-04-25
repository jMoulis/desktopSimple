/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Footer from '../../../components/Dashboard/Footer/footer';
import { startAppAction, setActiveAppAction } from '../../../store/reducers/frameReducer';

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
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const FooterContainer = createContainer(Footer);
export default FooterContainer;
