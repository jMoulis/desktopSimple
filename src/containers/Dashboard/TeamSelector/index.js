/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import TeamSelector from '../../../components/Dashboard/TeamSelector';
import { fetchUserAction } from '../../../store/reducers/userReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ userReducer, authReducer }) => ({
  userActive: userReducer.userActive,
  loggedUser: authReducer.loginProcess.loggedUser,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchUserAction: (userId) => {
    dispatch(fetchUserAction(userId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const TeamSelectorContainer = createContainer(TeamSelector);
export default TeamSelectorContainer;
