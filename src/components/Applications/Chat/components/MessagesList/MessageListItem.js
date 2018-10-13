import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import UserIconContainer from '../../../../../Modules/UserIcon';
import RepliesList from './RepliesList';
import RepliesListSmall from './RepliesList/RepliesListSmall';
import FormMessageItem from './FormMessageItem/FormMessageItem';
import Message from './Message';
import ActionPanel from './ActionPanel';

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
      showActionPanel: false,
      showActionPanelBtn: false,
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

  handleHideForm = stateParentKey => {
    this.setState(() => ({
      [stateParentKey]: false,
    }));
  };

  handleDeleteMessage = messageId => {
    const { socket, room } = this.props;
    socket.emit('MESSAGE_DELETE', {
      room,
      messageId,
    });
  };

  handleUpdateMessage = messageId => {
    this.setState(() => ({
      showInputChange: true,
      messageId,
    }));
  };

  handleShowActionPanel = () => {
    this.setState(prevState => ({
      showActionPanel: !prevState.showActionPanel,
    }));
  };

  handleDisplayActionMenuBtn = () => {
    this.setState(prevState => ({
      showActionPanelBtn: !prevState.showActionPanelBtn,
      showActionPanel: prevState.showActionPanelBtn && false,
    }));
  };

  handleHideForm = stateParentKey => {
    this.setState(() => ({
      [stateParentKey]: false,
    }));
  };

  render() {
    const {
      showReplyForm,
      showReplies,
      showActionPanelBtn,
      showActionPanel,
      showInputChange,
    } = this.state;
    const { message, loggedUser, socket, room } = this.props;
    return (
      <Fragment>
        <div
          className="d-flex flex-justify-between flex-align-items-center"
          onMouseEnter={this.handleDisplayActionMenuBtn}
          onMouseLeave={this.handleDisplayActionMenuBtn}
        >
          <Message
            message={message}
            socket={socket}
            room={room}
            loggedUser={loggedUser}
            showInputChange={showInputChange}
            callback={this.handleHideForm}
            typeSocketAction="MESSAGE_UPDATE"
          />
          {showActionPanelBtn && (
            <div className="chat-message-list-item-panel">
              <button
                type="button"
                className="chat-message-list-item-panel-action"
                onClick={this.handleShowActionPanel}
              >
                <i className="fas fa-ellipsis-v" />
              </button>
              {showActionPanel && (
                <ActionPanel
                  onDelete={this.handleDeleteMessage}
                  onUpdate={this.handleUpdateMessage}
                  onAnswer={this.handleShowReplyForm}
                  canAnswer
                  messageId={message._id}
                  isAllowed={loggedUser._id === message.sender._id}
                />
              )}
            </div>
          )}
        </div>

        {showReplyForm && (
          <div className="chat-message-list-item--content">
            <FormMessageItem
              socket={socket}
              room={room}
              typeSocketAction="NEW_REPLY"
              loggedUser={loggedUser}
              message={message}
              stateParentKey="showReplyForm"
              callback={this.handleHideForm}
            />
          </div>
        )}
        {showReplies ? (
          <Fragment>
            <RepliesListSmall
              replies={message.replies}
              callback={this.handleShowReplies}
            />
            <RepliesList
              replies={message.replies}
              message={message}
              socket={socket}
              room={room}
              loggedUser={loggedUser}
              callback={this.handleShowReplyForm}
            />
          </Fragment>
        ) : (
          <div className="d-flex flex-align-items-center">
            {message.replies.map(reply => (
              <UserIconContainer
                containerCss={{ padding: 0 }}
                user={{ user: reply.sender }}
                classCss="small"
                isSmall
                hideNotificationBadge
              />
            ))}
            <RepliesListSmall
              replies={message.replies}
              callback={this.handleShowReplies}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

export default MessageListItem;
