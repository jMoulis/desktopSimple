/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Settings from '../components/Settings';

/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
});

// Actions
const mapDispatchToProps = dispatch => ({});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const SettingsContainer = createContainer(Settings);
export default SettingsContainer;
