/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import TeamProject from '../../../../components/Dashboard/TeamSettings/TeamProject';
import { editTeamAction } from '../../../../store/reducers/teamReducer';
import { fetchSingleProjectAction } from '../../../../components/Applications/Projects/store/reducers/projectReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ mainTeamReducer, projectReducer }) => ({
  activeTeam: mainTeamReducer.activeTeamProcess.team,
  projects: projectReducer.projectListProcess.projects,
});

// Actions
const mapDispatchToProps = dispatch => ({
  editTeamAction: (values) => {
    dispatch(editTeamAction(values));
  },
  fetchSingleProjectAction: (projectId) => {
    dispatch(fetchSingleProjectAction(projectId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const TeamProjectContainer = createContainer(TeamProject);
export default TeamProjectContainer;
