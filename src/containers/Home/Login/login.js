/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Login from '../../../components/Home/Login/login';
import { loginAction } from '../../../store/reducers/authReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  loginProcess: authReducer.loginProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
  loginAction: (formData) => {
    dispatch(loginAction(formData));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const LoginContainer = createContainer(Login);
export default LoginContainer;
