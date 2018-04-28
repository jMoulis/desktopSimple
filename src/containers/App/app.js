
/*
* Npm import
*/
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';


/*
 * Local import
 */
import App from '../../components/App/app';
import { rehydrateAction } from '../../store/reducers/authReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  auth: authReducer.auth,
});

// Actions
const mapDispatchToProps = dispatch => ({
  rehydrateAction: () => {
    dispatch(rehydrateAction());
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const AppContainer = createContainer(App);
export default withRouter(AppContainer);
