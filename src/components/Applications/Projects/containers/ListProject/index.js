/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import ListProject from '../../components/ListProject/index';
import { fetchSingleProjectAction } from '../../store/reducers/projectReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer }) => ({
  projectListProcess: projectReducer.projectListProcess,
  activeProjectProcess: projectReducer.activeProjectProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchSingleProjectAction: projectId => {
    dispatch(fetchSingleProjectAction(projectId));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const ListProjectContainer = createContainer(ListProject);
export default ListProjectContainer;
