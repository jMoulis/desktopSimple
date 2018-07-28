/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import TextEditor from '../components';

/*
 * Code
 */
// State
const mapStateToProps = state => ({});

// Actions
const mapDispatchToProps = dispatch => ({});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TextEditorContainer = createContainer(TextEditor);
export default TextEditorContainer;
