/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Settings from '../../components/Profile';
import { editUserAction } from '../../store/reducers/profileReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ profileReducer }) => ({
  userActive: profileReducer.userActive,
});

// Actions
const mapDispatchToProps = dispatch => ({
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
