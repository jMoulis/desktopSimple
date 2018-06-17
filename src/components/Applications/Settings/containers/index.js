/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Settings from '../components/Settings';
import { deleteUserAction } from '../../../../store/reducers/authReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
});

// Actions
const mapDispatchToProps = dispatch => ({
  deleteUserAction: (userId) => {
    dispatch(deleteUserAction(userId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const SettingsContainer = createContainer(Settings);
export default SettingsContainer;
