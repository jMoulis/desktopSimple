import { connect } from 'react-redux';
import PrivateMessageRoom from '../../../components/RoomsList/PrivateMessageRoom';
import {
  fetchRoomsAndUpdateStatus,
  setDefaultRoomAction,
} from '../../../../../../store/reducers/chatReducer';

const mapStateToProps = ({ chatReducer, notificationsReducer }) => ({
  defaultRoom: chatReducer.defaultRoom,
  notifications: notificationsReducer.notifications,
});

const mapDispatchToProps = dispatch => ({
  fetchRoomsAndUpdateStatus: (roomId, loggedUserId, status) => {
    dispatch(fetchRoomsAndUpdateStatus(roomId, loggedUserId, status));
  },
  setDefaultRoomAction: () => {
    dispatch(setDefaultRoomAction());
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const PrivateMessageRoomContainer = createContainer(PrivateMessageRoom);

export default PrivateMessageRoomContainer;
