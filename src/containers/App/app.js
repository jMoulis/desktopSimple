
/*
* Npm import
*/
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


/*
 * Local import
 */
import App from '../../components/App/app';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  loginProcess: authReducer.loginProcess,
});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const AppContainer = createContainer(App);
export default withRouter(AppContainer);
