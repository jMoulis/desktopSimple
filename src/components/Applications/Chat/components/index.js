import React from 'react';
import io from 'socket.io-client';
import ListRoomsContainer from '../containers/ListRooms';
import ListMessagesContainer from '../containers/ListMessages';
import NewMessage from './NewMessage';
import './index.css';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const user = props.loggedUser;
    this.state = {
      messages: [],
    };
    this.socket = io('http://localhost:3050');
    this.socket.on('connect', () => {
      this.socket.emit(
        'join',
        { room: user.rooms[0], user: { name: user.fullName } },
        (err) => {
          if (err) {
            console.error(err);
          }
          console.log('no Error');
        },
      );
      this.socket.on('disconnect', () => {
        console.log('Disconnect from chat');
      });
    });
    this.socket.on('newMessage', (response) => {
      this.setState(prevState => ({
        ...prevState,
        messages: [
          ...prevState.messages,
          response.message,
        ],
      }));
    });
  }
  componentDidMount() {}
  componentWillUnmount() {
    this.socket.disconnect();
  }
  handleSubmit = (message) => {
    const user = this.props.loggedUser;
    this.socket.emit('createMessage', {
      message: {
        author: user.fullName,
        message,
        room: user.rooms[0],
        documents: [],
      },
    });
  }
  render() {
    const { loggedUser } = this.props;
    return (
      <div className="chat">
        <ListRoomsContainer loggedUser={loggedUser} />
        <div className="chat-content">
          <ListMessagesContainer messages={this.state.messages} />
          <NewMessage onSubmit={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

export default Chat;
