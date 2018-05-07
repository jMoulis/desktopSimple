/*
 * Npm import
 */
import { connect } from 'react-redux';
import { fetchUsersCountAction } from '../../../../../store/reducers/userReducer';

/*
 * Local import
 */
import Team from '../../components/Team';
/*
 * Code
 */
// State
const mapStateToProps = ({ userReducer }) => ({
  usersCount: userReducer.usersCount,
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchUsersCountAction: (filter) => {
    dispatch(fetchUsersCountAction(filter));
  },
});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const TeamContainer = createContainer(Team);
export default TeamContainer;
