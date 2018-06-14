/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import ProjectInfo from '../../components/Team/projectInfo';
/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer }) => ({
  project: projectReducer.activeProjectProcess.project,
});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const ProjectInfoContainer = createContainer(ProjectInfo);
export default ProjectInfoContainer;
