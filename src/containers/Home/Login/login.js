/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Login from '../../../components/Home/Login/login';

/*
 * Code
 */
// State
const mapStateToProps = ({ frameReducer }) => ({});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const LoginContainer = createContainer(Login);
export default LoginContainer;
