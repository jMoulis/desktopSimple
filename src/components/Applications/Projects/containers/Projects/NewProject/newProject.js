/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import NewProject from '../../../components/NewProject/index';
import { createProjectAction } from '../../../store/reducers/projectReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer, projectReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
  projectCreation: projectReducer.projectCreation,
});

// Actions
const mapDispatchToProps = dispatch => ({
  createProjectAction: (values) => {
    dispatch(createProjectAction(values));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const NewProjectContainer = createContainer(NewProject);
export default NewProjectContainer;
