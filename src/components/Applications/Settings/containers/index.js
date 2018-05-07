/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Settings from '../components/Settings';
import { fetchSingleUserAction } from '../store/reducers/profileReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer, profileReducer }) => ({
  loginProcess: authReducer.loginProcess,
  userActive: profileReducer.userActive,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchSingleUserAction: (userId) => {
    dispatch(fetchSingleUserAction(userId));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const SettingsContainer = createContainer(Settings);
export default SettingsContainer;
