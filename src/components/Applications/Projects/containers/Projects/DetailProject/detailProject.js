/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import DetailProject from '../../../components/DetailProject';
import { editProjectAction, clearMessageAction } from '../../../store/reducers/projectReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer }) => ({
  activeProjectProcess: projectReducer.activeProjectProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
  clearMessageAction: () => {
    dispatch(clearMessageAction());
  },
  editProjectAction: (values) => {
    dispatch(editProjectAction(values));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const DetailProjectContainer = createContainer(DetailProject);
export default DetailProjectContainer;
