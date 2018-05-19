/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import TextEditor from '../components/textEditor';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer, profileReducer }) => ({
  loginProcess: authReducer.loginProcess,
  userActive: profileReducer.userActive,
});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const TextEditorContainer = createContainer(TextEditor);
export default TextEditorContainer;
