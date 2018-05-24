/*
 * Npm import
 */
import { connect } from 'react-redux';
import { fetchUsersCountAction } from '../../../store/reducers/userReducer';
import { editTeamAction, clearTeamMessageAction, deleteTeamAction } from '../../../store/reducers/teamReducer';

/*
 * Local import
 */
import EditTeam from '../../../components/Dashboard/TeamSettings/EditTeam/edit';
/*
 * Code
 */
// State
const mapStateToProps = ({ userReducer, mainTeamReducer }) => ({
  usersCount: userReducer.usersCount,
  activeTeamProcess: mainTeamReducer.activeTeamProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchUsersCountAction: (filter) => {
    dispatch(fetchUsersCountAction(filter));
  },
  editTeamAction: (values) => {
    dispatch(editTeamAction(values));
  },
  deleteTeamAction: (teamId) => {
    dispatch(deleteTeamAction(teamId));
  },
  clearTeamMessageAction: () => {
    dispatch(clearTeamMessageAction());
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const EditTeamContainer = createContainer(EditTeam);
export default EditTeamContainer;
