/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import TeamToolbar from '../../../components/Dashboard/TeamToolbar';
import { showUserDetailModalAction } from '../../../store/reducers/appReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ mainTeamReducer }) => ({
  team: mainTeamReducer.activeTeamProcess.team,
});

// Actions
const mapDispatchToProps = dispatch => ({
  showUserDetailModalAction: (userId) => {
    dispatch(showUserDetailModalAction(userId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const TeamToolbarContainer = createContainer(TeamToolbar);
export default TeamToolbarContainer;
