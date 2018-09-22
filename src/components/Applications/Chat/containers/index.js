/*
 * Npm import
 */
import { connect } from 'react-redux';

/*
 * Local import
 */
import Chat from '../components';
import { fetchChatAction } from '../store/reducers/chatReducer';
/*
 * Code
 */

// State
const mapStateToProps = state => ({});

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
