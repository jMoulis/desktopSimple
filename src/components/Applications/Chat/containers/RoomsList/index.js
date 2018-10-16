import { connect } from 'react-redux';
import RoomsList from '../../components/RoomsList';
import {
  fetchRoomsAndUpdateStatus,
  setDefaultRoomAction,
} from '../../../../../store/reducers/chatReducer';

const mapStateToProps = ({ chatReducer }) => ({
  defaultRoom: chatReducer.defaultRoom,
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

const RoomsListContainer = createContainer(RoomsList);

export default RoomsListContainer;
