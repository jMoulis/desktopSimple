/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Content from '../../../components/Home/Content/content';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  loginForm: authReducer.loginForm,
});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const ContentContainer = createContainer(Content);
export default ContentContainer;
