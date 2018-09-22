import { connect } from 'react-redux';

import AddressBook from '../components/index';
import { fetchUsersAction } from '../../../../store/reducers/userReducer';

const mapStateToProps = ({ userReducer }) => ({
  usersProcess: userReducer.userList,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchUsersAction: filter => {
    dispatch(fetchUsersAction(filter));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const AddressBookContainer = createContainer(AddressBook);
export default AddressBookContainer;
