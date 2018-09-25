import React from 'react';
import PropTypes from 'prop-types';
import MessageList from '../containers/MessagesList';
import './index.css';
import RoomsList from './RoomsList';
import SendRoomMessageForm from './SendRoomMessageForm';
import ConnectedUserList from '../containers/ConnectedUserList';

class Chat extends React.Component {
  static propTypes = {
    room: PropTypes.object,
    fetchRoomAction: PropTypes.func.isRequired,
    newRoomMessageSuccessAction: PropTypes.func.isRequired,
    globalProps: PropTypes.object.isRequired,
    fetchRoomsAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    roomsFetchProcess: PropTypes.object.isRequired,
  };

  static defaultProps = {
    room: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      room: props.room,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.room && !state.room) {
      return {
        ...state,
        room: props.room,
      };
    }
    return {
      ...state,
    };
  }

  componentDidMount() {
    const { fetchRoomsAction, newRoomMessageSuccessAction, room } = this.props;
    fetchRoomsAction('global');
    this.props.globalProps.socketIo.on(
      'NEW_ROOM_MESSAGE_SUCCESS',
      newRoomMessageSuccessAction,
    );
    this.addRoomToState(room);
  }
  addRoomToState = room => this.setState(() => ({ room }));

  handleSelectRoom = room => {
    const { fetchRoomAction } = this.props;
    fetchRoomAction(room._id);
    this.setState(() => ({
      room,
    }));
  };

  render() {
    const {
      roomsFetchProcess: { rooms },
      loggedUser,
      globalProps: { socketIo },
    } = this.props;
    const { room } = this.state;
    return (
      <div className="chat">
        {rooms && <RoomsList rooms={rooms} callback={this.handleSelectRoom} />}
        <div className="chat-content">
          <h1>{room && room.name}</h1>
          <MessageList socket={socketIo} loggedUser={loggedUser} />
          <SendRoomMessageForm
            loggedUser={loggedUser}
            room={room}
            socket={socketIo}
          />
        </div>
        <ConnectedUserList />
      </div>
    );
  }
}

export default Chat;
