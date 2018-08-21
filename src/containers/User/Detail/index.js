/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import DetailUser from '../../../components/User/Detail/';
import { fetchUserAction } from '../../../store/reducers/userReducer';

/*
 * Code
 */
// State
const mapStateToProps = ({ userReducer, appReducer }) => ({
  userActive: userReducer.userActive,
  userId: appReducer.userId,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchUserAction: userId => {
    dispatch(fetchUserAction(userId));
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const DetailUserContainer = createContainer(DetailUser);
export default DetailUserContainer;
