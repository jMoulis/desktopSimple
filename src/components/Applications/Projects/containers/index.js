/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Project from '../components/index';
import { fetchProjectsAction } from '../store/reducers/projectReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
});

// Actions
const mapDispatchToProps = dispatch => ({
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
