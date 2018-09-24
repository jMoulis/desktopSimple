import React from 'react';
import PropTypes from 'prop-types';
import MessageList from '../containers/MessagesList';
import './index.css';

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
  handleSubmit = evt => {
    evt.preventDefault();
    const {
      loggedUser,
      globalProps: { socketIo },
    } = this.props;
    const { room } = this.state;
    socketIo.emit('ROOM_MESSAGE', {
      room,
      sender: loggedUser._id,
      message: this.state.message,
    });
  };

  handleTextAreaChange = evt => {
    const { value } = evt.target;
    this.setState(() => ({
      message: value,
    }));
  };

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
    return (
      <div className="chat">
        <ul className="chat-list-room">
          {rooms &&
            rooms.map(room => (
              <li key={room._id}>
                <button onClick={() => this.handleSelectRoom(room)}>
                  {room.name}
                </button>
              </li>
            ))}
        </ul>
        <div className="chat-content">
          <MessageList socket={socketIo} loggedUser={loggedUser} />
          <form onSubmit={this.handleSubmit}>
            <textarea onChange={this.handleTextAreaChange} />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Chat;
