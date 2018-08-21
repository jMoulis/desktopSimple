/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Chat from '../components/index';
import { fetchChatAction } from '../store/reducers/chatReducer';
/*
 * Code
 */
const getLoggedUser = () => {
  if (localStorage.getItem('user')) {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    return loggedUser;
  }
  return null;
};
// State
const mapStateToProps = state => ({
  loggedUserId: getLoggedUser(),
});

// Actions
const mapDispatchToProps = dispatch => ({
  fetchChatAction: () => {
    dispatch(fetchChatAction());
  },
});

/*
 * Export default
 */
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const ChatContainer = createContainer(Chat);
export default ChatContainer;
