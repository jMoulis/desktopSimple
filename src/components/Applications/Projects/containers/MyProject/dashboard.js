/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Dashboard from '../../components/MyProject/dashboard';

/*
 * Code
 */
// State
const mapStateToProps = state => ({});

// Actions
const mapDispatchToProps = dispatch => ({
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const DashboardContainer = createContainer(Dashboard);
export default DashboardContainer;
