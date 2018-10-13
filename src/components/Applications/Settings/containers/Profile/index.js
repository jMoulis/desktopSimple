/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Settings from '../../components/Profile';
import {
  editUserAction,
  clearMessageAction,
} from '../../../../../store/reducers/authReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  editUser: authReducer.editUser,
});

// Actions
const mapDispatchToProps = dispatch => ({
  editUserAction: (id, formData) => {
    dispatch(editUserAction(id, formData));
  },
  clearMessageAction: () => {
    dispatch(clearMessageAction());
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const SettingsContainer = createContainer(Settings);
export default SettingsContainer;
