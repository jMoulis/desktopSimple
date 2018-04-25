/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Dashboard from '../../components/Dashboard/dashboard';
import { setActiveAppAction } from '../../store/reducers/frameReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ frameReducer }) => ({
  activeApp: frameReducer.activeApp,
  applications: frameReducer.applications,
  activeApps: frameReducer.activeApps,
});

// Actions
const mapDispatchToProps = dispatch => ({
  setActiveAppAction: (app) => {
    dispatch(setActiveAppAction(app));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const DashboardContainer = createContainer(Dashboard);
export default DashboardContainer;
