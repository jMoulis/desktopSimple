/*
* Npm import
*/
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

/*
 * Local import
 */
import App from '../../components/App/app';
import { rehydrateAction } from '../../store/reducers/authReducer';
import { fetchSingleTeamAction } from '../../store/reducers/teamReducer';
import { fetchUserAction } from '../../store/reducers/userReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer, mainTeamReducer, userReducer }) => ({
  auth: authReducer.auth,
  loginProcess: authReducer.loginProcess,
  activeTeamProcess: mainTeamReducer.activeTeamProcess,
  userActive: userReducer.userActive,
});

// Actions
const mapDispatchToProps = dispatch => ({
  rehydrateAction: () => {
    dispatch(rehydrateAction());
  },
  fetchSingleTeamAction: teamId => {
    dispatch(fetchSingleTeamAction(teamId));
  },
  fetchUserAction: userId => {
    dispatch(fetchUserAction(userId));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const AppContainer = createContainer(App);
export default withRouter(AppContainer);
