import React from 'react';
import PropTypes from 'prop-types';
import Message from '../Message';
import UserIconContainer from '../../../../../../Modules/UserIcon';
import './index.css';

class RepliesList extends React.Component {
  static propTypes = {
    room: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    replies: PropTypes.array.isRequired,
  };
  state = {
    showReplies: false,
  };
  handleDeleteMessage = messageId => {
    const { socket, room } = this.props;
    socket.emit('DELETE_REPLY', {
      room,
      messageId,
    });
  };

  handleSubmit = ({ text, socketActionType, message }) => {
    const { socket, room, loggedUser } = this.props;
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

  handleHideForm = () => {
    this.setState(() => ({
      showInputChange: false,
    }));
  };

  handleShowReplies = () => {
    this.setState(prevState => ({
      showReplies: !prevState.showReplies,
    }));
  };

  displayThumbnailRepliesList = replies => {
    const maxReplies = replies.slice(0, 5);
    const maxRepliesLength = maxReplies.length;
    const lengthReplies = replies.length;
    if (lengthReplies > maxReplies.length) {
      return (
        <div className="d-flex relative">
          {maxReplies.map(reply => (
            <UserIconContainer
              key={reply._id}
              containerCss={{ padding: 0 }}
              user={{ user: reply.sender }}
              classCss="small"
              isSmall
              hideNotificationBadge
            />
          ))}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: 0,
              right: 0,
              width: '24px',
              height: '26px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
            className="absolute"
          >
            {lengthReplies - maxRepliesLength}+
          </div>
        </div>
      );
    }
    return maxReplies.map(reply => (
      <UserIconContainer
        key={reply._id}
        containerCss={{ padding: 0 }}
        user={{ user: reply.sender }}
        classCss="small"
        isSmall
        hideNotificationBadge
      />
    ));
  };

  renderReply = count => {
    if (count > 1) return 'replies';
    return 'reply';
  };

  render() {
    const { replies, loggedUser } = this.props;
    const { showReplies } = this.state;
    return (
      <div className="replies-list">
        <div className="d-flex flex-align-items-center replies-list-small">
          {this.displayThumbnailRepliesList(replies)}
          {replies.length && replies.length > 0 ? (
            <button
              className="replies-list-small-button"
              onClick={this.handleShowReplies}
            >
              {`${replies.length} ${this.renderReply(replies.length)}`}
            </button>
          ) : (
            ''
          )}
        </div>
        {showReplies &&
          replies.map((reply, index) => (
            <Message
              key={index}
              message={reply}
              socketActionType="UPDATE_REPLY"
              loggedUser={loggedUser}
              callbacks={{
                showReplyAction: () => this.handleShowReplyForm(),
                onSubmit: value => this.handleSubmit(value),
                onDelete: messageId => this.handleDeleteMessage(messageId),
              }}
            />
          ))}
      </div>
    );
  }
}

export default RepliesList;
