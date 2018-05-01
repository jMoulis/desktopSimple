/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Project from '../../components/index';
import { createProjectAction, fetchProjectsAction } from '../../store/reducers/projectReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
});

// Actions
const mapDispatchToProps = dispatch => ({
  createProjectAction: (values) => {
    dispatch(createProjectAction(values));
  },
  fetchProjectsAction: (values) => {
    dispatch(fetchProjectsAction(values));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const ProjectContainer = createContainer(Project);
export default ProjectContainer;
