/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Dashboard from '../../components/MyTeams/dashboard';
import { fetchSingleTeamAction } from '../../store/reducers/teamReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ teamReducer }) => ({
  activeTeamProcess: teamReducer.activeTeamProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchSingleTeamAction: (teamId) => {
    dispatch(fetchSingleTeamAction(teamId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const DashboardContainer = createContainer(Dashboard);
export default DashboardContainer;
