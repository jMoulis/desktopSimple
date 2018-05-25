/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import TeamProject from '../../../../components/Dashboard/TeamSettings/TeamProject';
import { editTeamAction } from '../../../../store/reducers/teamReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ mainTeamReducer }) => ({
  activeTeam: mainTeamReducer.activeTeamProcess.team,
});

// Actions
const mapDispatchToProps = dispatch => ({
  editTeamAction: (values) => {
    dispatch(editTeamAction(values));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const TeamProjectContainer = createContainer(TeamProject);
export default TeamProjectContainer;
