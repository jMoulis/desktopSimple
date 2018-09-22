/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import TeamToolbar from '../../../components/Dashboard/TeamToolbar';
import { showUserDetailModalAction } from '../../../store/reducers/appReducer';
import { fetchSingleTeamAction } from '../../../store/reducers/teamReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ mainTeamReducer, authReducer }) => ({
  team: mainTeamReducer.activeTeamProcess.team,
  editUser: authReducer.editUser,
});

// Actions
const mapDispatchToProps = dispatch => ({
  showUserDetailModalAction: userId => {
    dispatch(showUserDetailModalAction(userId));
  },
  fetchSingleTeamAction: teamId => {
    dispatch(fetchSingleTeamAction(teamId));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TeamToolbarContainer = createContainer(TeamToolbar);
export default TeamToolbarContainer;
