/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Home from '../../components/Home/home';

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
const HomeContainer = createContainer(Home);
export default HomeContainer;
