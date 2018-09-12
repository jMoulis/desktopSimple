/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Account from '../../../components/Profile/Account';
import {
  changePasswordAction,
  clearMessageAction,
  deleteUserAction,
} from '../../../../../../store/reducers/authReducer';
/*
 * Code
 */
// State
const mapStateToProps = ({ authReducer }) => ({
  loggedUser: authReducer.loginProcess.loggedUser,
  editUser: authReducer.editUser,
});
// Actions
const mapDispatchToProps = dispatch => ({
  changePasswordAction: (id, formData) => {
    dispatch(changePasswordAction(id, formData));
  },
  clearMessageAction: () => {
    dispatch(clearMessageAction());
  },
  deleteUserAction: userId => {
    dispatch(deleteUserAction(userId));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const AccountContainer = createContainer(Account);
export default AccountContainer;
