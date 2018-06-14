/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import Account from '../../../components/Profile/Account';
import { changePasswordAction, clearMessageAction } from '../../../store/reducers/profileReducer';
/*
 * Code
 */
// State
const mapStateToProps = state => ({});

// Actions
const mapDispatchToProps = dispatch => ({
  changePasswordAction: (id, formData) => {
    dispatch(changePasswordAction(id, formData));
  },
  clearMessageAction: () => {
    dispatch(clearMessageAction());
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const AccountContainer = createContainer(Account);
export default AccountContainer;
