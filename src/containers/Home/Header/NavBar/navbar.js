/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import NavBar from '../../../../components/Home/Header/NavBar/navbar';
import { displayLoginFormAction } from '../../../../store/reducers/authReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  loginForm: authReducer.loginForm,
});

// Actions
const mapDispatchToProps = dispatch => ({
  displayLoginFormAction: () => {
    dispatch(displayLoginFormAction());
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const NavBarContainer = createContainer(NavBar);
export default NavBarContainer;
