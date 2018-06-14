/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import ListMessages from '../../components/ListMessages';
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
const mapStateToProps =  state => ({
  loggedUser: getLoggedUser(),
});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const ListMessagesContainer = createContainer(ListMessages);
export default ListMessagesContainer;
