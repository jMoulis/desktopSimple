/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import NavBar from '../../../../components/Home/Header/NavBar/navbar';

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
const NavBarContainer = createContainer(NavBar);
export default NavBarContainer;
