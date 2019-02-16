import { connect } from 'react-redux';
import RoomsList from '../../components/RoomsList';
import { deleteRoomAction } from '../../../../../store/reducers/chatReducer';

const mapStateToProps = ({ notificationsReducer }) => ({
  notifications: notificationsReducer.notifications,
});

const mapDispatchToProps = dispatch => ({
  deleteRoomAction: roomId => {
    dispatch(deleteRoomAction(roomId));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const RoomsListContainer = createContainer(RoomsList);

export default RoomsListContainer;
