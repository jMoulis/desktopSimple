/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import TeamToolbar from '../../../components/Dashboard/TeamToolbar';

/*
 * Code
 */
// State
const mapStateToProps = ({ mainTeamReducer }) => ({
  team: mainTeamReducer.activeTeamProcess.team,
});

// Actions
const mapDispatchToProps = dispatch => ({
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const TeamToolbarContainer = createContainer(TeamToolbar);
export default TeamToolbarContainer;
