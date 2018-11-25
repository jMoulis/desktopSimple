import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RepliesList from './RepliesList';
import Message from './Message';
import FormMessageItem from './FormMessageItem/FormMessageItem';

class MessageListItem extends React.Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showReplyForm: false,
    };
  }

  handleShowReplyForm = messageId => {
    this.setState(() => ({
      showReplyForm: true,
      messageId,
    }));
  };

  handleShowReplies = () => {
    this.setState(prevState => ({
      showReplies: !prevState.showReplies,
    }));
  };

  handleDeleteMessage = messageId => {
    const { socket, room } = this.props;
    socket.emit('DELETE_MESSAGE', {
      room,
      messageId,
    });
  };

  handleSubmit = ({ text, socketActionType }) => {
    const { socket, room, loggedUser, message } = this.props;
    socket.emit(socketActionType, {
      room,
      message: text,
      messageId: message._id,
      sender: {
        _id: loggedUser._id,
        fullName: loggedUser.fullName,
        picture: loggedUser.picture,
      },
    });
  };

  handleHideReplyForm = () => {
    this.setState(() => ({
      showReplyForm: false,
    }));
  };

  render() {
    const { showReplyForm } = this.state;
    const { message, loggedUser, socket, room } = this.props;
    return (
      <Fragment>
        <Message
          message={message}
          socketActionType="UPDATE_MESSAGE"
          loggedUser={loggedUser}
          callbacks={{
            showReplyAction: () => this.handleShowReplyForm(),
            onSubmit: value => this.handleSubmit(value),
            onDelete: messageId => this.handleDeleteMessage(messageId),
          }}
          canAnswer
        />
        {showReplyForm && (
          <FormMessageItem
            value=""
            onSubmit={text => {
              this.handleSubmit({ text, socketActionType: 'NEW_REPLY' });
              this.handleHideReplyForm();
            }}
            callback={this.handleHideReplyForm}
          />
        )}
        <RepliesList
          replies={message.replies}
          message={message}
          socket={socket}
          room={room}
          loggedUser={loggedUser}
          callback={this.handleShowReplyForm}
        />
      </Fragment>
    );
  }
}

export default MessageListItem;
