import { connect } from 'react-redux';
import RoomsList from '../../components/RoomsList';
import { fetchRoomsAndUpdateStatus } from '../../../../../store/reducers/chatReducer';

const mapDispatchToProps = dispatch => ({
  fetchRoomsAndUpdateStatus: (roomId, loggedUserId, status) => {
    dispatch(fetchRoomsAndUpdateStatus(roomId, loggedUserId, status));
  },
});

const createContainer = connect(
  null,
  mapDispatchToProps,
);

const RoomsListContainer = createContainer(RoomsList);

export default RoomsListContainer;
