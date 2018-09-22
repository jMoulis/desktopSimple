/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import EditFormProject from '../../components/DetailProject/editFormProject';
import { editProjectAction, clearProjectMessageAction } from '../../store/reducers/projectReducer';
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
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const EditFormProjectContainer = createContainer(EditFormProject);
export default EditFormProjectContainer;
