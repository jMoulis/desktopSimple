/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import DetailProject from '../../../components/DetailProject';
import { editProjectAction, clearProjectMessageAction, fetchSingleProjectAction, purgeActiveProjectAction } from '../../../store/reducers/projectReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer, authReducer }) => ({
  activeProjectProcess: projectReducer.activeProjectProcess,
  loggedUser: authReducer.loginProcess.loggedUser,
});

// Actions
const mapDispatchToProps = dispatch => ({
  clearProjectMessageAction: () => {
    dispatch(clearProjectMessageAction());
  },
  editProjectAction: (values) => {
    dispatch(editProjectAction(values));
  },
  fetchSingleProjectAction: (projectId) => {
    dispatch(fetchSingleProjectAction(projectId));
  },
  purgeActiveProjectAction: (projectId) => {
    dispatch(purgeActiveProjectAction(projectId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const DetailProjectContainer = createContainer(DetailProject);
export default DetailProjectContainer;
