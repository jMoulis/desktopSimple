/*
 * Npm import
 */
import { connect } from 'react-redux';
import { fetchUsersCountAction } from '../../../../../../../store/reducers/userReducer';
import {
  createTeamAction,
  clearTeamMessageAction,
} from '../../../../../../../store/reducers/teamReducer';

/*
 * Local import
 */
import NewTeam from '../../../../components/Profile/Teams/NewTeam';
/*
 * Code
 */
// State
const mapStateToProps = ({ userReducer, projectReducer, mainTeamReducer }) => ({
  usersCount: userReducer.usersCount,
  project: projectReducer.activeProjectProcess.project,
  teamCreation: mainTeamReducer.teamCreation,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchUsersCountAction: filter => {
    dispatch(fetchUsersCountAction(filter));
  },
  createTeamAction: values => {
    dispatch(createTeamAction(values));
  },
  clearTeamMessageAction: () => {
    dispatch(clearTeamMessageAction());
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const NewTeamContainer = createContainer(NewTeam);
export default NewTeamContainer;
