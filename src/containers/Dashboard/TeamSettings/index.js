/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import TeamSettings from '../../../components/Dashboard/TeamSettings';

/*
 * Code
 */
// State
const mapStateToProps = ({ mainTeamReducer }) => ({
  activeTeamProcess: mainTeamReducer.activeTeamProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const TeamSettingsContainer = createContainer(TeamSettings);
export default TeamSettingsContainer;
