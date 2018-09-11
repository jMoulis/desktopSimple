/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import NewProject from '../../components/NewProject/index';
import {
  createProjectAction,
  clearProjectMessageAction,
} from '../../store/reducers/projectReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer }) => ({
  projectCreation: projectReducer.projectCreation,
});

// Actions
const mapDispatchToProps = dispatch => ({
  createProjectAction: values => {
    dispatch(createProjectAction(values));
  },
  clearProjectMessageAction: () => {
    dispatch(clearProjectMessageAction());
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const NewProjectContainer = createContainer(NewProject);
export default NewProjectContainer;
