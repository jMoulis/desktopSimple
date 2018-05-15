/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import MyProject from '../../components/MyProject';

/*
 * Code
 */
// State
const mapStateToProps = ({ projectReducer }) => ({
  projectListProcess: projectReducer.projectListProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const MyProjectContainer = createContainer(MyProject);
export default MyProjectContainer;
