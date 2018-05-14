/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import DetailProject from '../../components/DetailProject';
import { editProjectAction, clearProjectMessageAction, deleteProjectAction } from '../../store/reducers/projectReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer }) => ({
  activeProjectProcess: projectReducer.activeProjectProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
  clearProjectMessageAction: () => {
    dispatch(clearProjectMessageAction());
  },
  editProjectAction: (values) => {
    dispatch(editProjectAction(values));
  },
  deleteProjectAction: (projectId) => {
    dispatch(deleteProjectAction(projectId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const DetailProjectContainer = createContainer(DetailProject);
export default DetailProjectContainer;
