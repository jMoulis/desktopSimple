/*
 * Npm import
 */
import { connect } from 'react-redux';


/*
 * Local import
 */
import ListRooms from '../../components/ListRooms';
/*
 * Code
 */

// State
const mapStateToProps =  state => ({});

// Actions
const mapDispatchToProps = dispatch => ({});


/*
 * Export default
 */
const createContainer = connect(mapStateToProps, mapDispatchToProps);
const ListRoomsContainer = createContainer(ListRooms);
export default ListRoomsContainer;
