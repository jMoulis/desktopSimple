/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Settings from '../../components/Profile';
import { editUserAction, fetchSingleUserAction } from '../../store/reducers/profileReducer';
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
  editUserAction: (id, formData) => {
    dispatch(editUserAction(id, formData));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const SettingsContainer = createContainer(Settings);
export default SettingsContainer;
