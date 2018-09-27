import { connect } from 'react-redux';
import ConnectedUserList from '../../components/ConnectedUserList';

const mapStateToProps = ({ appReducer }) => ({
  connectedUsers: appReducer.connectedUsers,
});

const mapDispatchToProps = dispatch => ({});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const ConnectedUserListContainer = createContainer(ConnectedUserList);

export default ConnectedUserListContainer;
