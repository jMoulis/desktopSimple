import { connect } from 'react-redux';
import ConnectedUserList from '../../components/ConnectedUserList';

const mapStateToProps = ({ appReducer }) => ({
  connectedUsers: appReducer.connectedUsers,
});

const createContainer = connect(
  mapStateToProps,
  null,
);

const ConnectedUserListContainer = createContainer(ConnectedUserList);

export default ConnectedUserListContainer;
