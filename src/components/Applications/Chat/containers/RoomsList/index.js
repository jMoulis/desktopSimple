import { connect } from 'react-redux';
import RoomsList from '../../components/RoomsList';
import { hidePrivateRoomAction } from '../../../../../store/reducers/authReducer';

const mapDispatchToProps = dispatch => ({
  hidePrivateRoomAction: (roomId, loggedUserId, status) => {
    dispatch(hidePrivateRoomAction(roomId, loggedUserId, status));
  },
});

const createContainer = connect(
  null,
  mapDispatchToProps,
);

const RoomsListContainer = createContainer(RoomsList);

export default RoomsListContainer;
