/*
 * Npm import
 */
import { connect } from 'react-redux';
import { fetchUsersCountAction } from '../../../../../store/reducers/userReducer';
import { createTeamAction } from '../../store/reducers/teamReducer';

/*
 * Local import
 */
import Team from '../../components/Team';
/*
 * Code
 */
// State
const mapStateToProps = ({ userReducer, projectReducer, teamReducer }) => ({
  usersCount: userReducer.usersCount,
  project: projectReducer.activeProjectProcess.project,
  teamCreation: teamReducer.teamCreation,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchUsersCountAction: filter => {
    dispatch(fetchUsersCountAction(filter));
  },
  createTeamAction: values => {
    dispatch(createTeamAction(values));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TeamContainer = createContainer(Team);
export default TeamContainer;
