/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import SignUp from '../../../components/User/SignUp/signup';
import { createUserAction } from '../../../store/reducers/authReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  createUserProcess: authReducer.createUserProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({
  createUserAction: (values) => {
    dispatch(createUserAction(values));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const SignUpContainer = createContainer(SignUp);
export default SignUpContainer;
