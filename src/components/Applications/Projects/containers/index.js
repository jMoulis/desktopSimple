/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Project from '../components/index';
import { fetchProjectsAction } from '../store/reducers/projectReducer';
import { fetchTeamsAction } from '../store/reducers/teamReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  editUser: authReducer.editUser,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchProjectsAction: filter => {
    dispatch(fetchProjectsAction(filter));
  },
  fetchTeamsAction: () => {
    dispatch(fetchTeamsAction());
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const ProjectContainer = createContainer(Project);
export default ProjectContainer;
