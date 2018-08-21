/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Teams from '../../../components/Profile/Teams';
import { fetchTeamsAction } from '../../../../../../store/reducers/teamReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer, mainTeamReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
  teamsProcess: mainTeamReducer.teamListProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchTeamsAction: userId => {
    dispatch(fetchTeamsAction(userId));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TeamsContainer = createContainer(Teams);
export default TeamsContainer;
