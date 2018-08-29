import { connect } from 'react-redux';

import { sendFriendRequest } from '../../../../../store/reducers/userReducer';
import UserListItem from '../../components/Users/UserListItem';

const mapStateToProps = ({ userReducer }) => ({
  usersProcess: userReducer.userList,
  requestStatus: userReducer.requestStatus,
});

// Actions
const mapDispatchToProps = dispatch => ({
  sendFriendRequest: filter => {
    dispatch(sendFriendRequest(filter));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const UserListItemContainer = createContainer(UserListItem);
export default UserListItemContainer;
