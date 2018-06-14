import { connect } from 'react-redux';

import UsersLoader from '../../../components/Dashboard/TeamSettings/EditTeam/usersLoader';
import { fetchUsersAction } from '../../../store/reducers/userReducer';

const mapStateToProps = ({ projectReducer, userReducer }) => ({
  project: projectReducer.activeProjectProcess.project,
  userList: userReducer.userList,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchUsersAction: (filter) => {
    dispatch(fetchUsersAction(filter));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const UsersLoaderContainer = createContainer(UsersLoader);

export default UsersLoaderContainer;
