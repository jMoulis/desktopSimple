import { connect } from 'react-redux';
import RoomsList from '../../components/RoomsList';

const mapStateToProps = ({ notificationsReducer }) => ({
  notifications: notificationsReducer.notifications,
});

const createContainer = connect(
  mapStateToProps,
  null,
);

const RoomsListContainer = createContainer(RoomsList);

export default RoomsListContainer;
