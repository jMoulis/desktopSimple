/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Header from '../../../components/Home/Header/header';

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
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const HeaderContainer = createContainer(Header);
export default HeaderContainer;
