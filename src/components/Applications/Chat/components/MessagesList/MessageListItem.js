import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UserIconContainer from '../../../../../Modules/UserIcon';
import ActionPanel from './ActionPanel';

class MessageListItem extends React.Component {
  state = {
    showActionPanelBtn: false,
    showActionPanel: false,
  };

  handleDisplayActionMenuBtn = () => {
    this.setState(prevState => ({
      showActionPanelBtn: !prevState.showActionPanelBtn,
      showActionPanel: prevState.showActionPanelBtn && false,
    }));
  };
  handleShowActionPanel = () => {
    this.setState(prevState => ({
      showActionPanel: !prevState.showActionPanel,
    }));
  };

  handleDeleteMessage = messageId => {
    console.log(messageId);
  };

  handleUpdateMessage = messageId => {
    console.log(messageId);
  };

  render() {
    const { message } = this.props;
    const { showActionPanelBtn, showActionPanel } = this.state;
    return (
      <div
        className="chat-message-list-item"
        onMouseEnter={this.handleDisplayActionMenuBtn}
        onMouseLeave={this.handleDisplayActionMenuBtn}
      >
        <div className="chat-message-list-item--header">
          <UserIconContainer
            user={{ user: message.sender }}
            hideNotificationBadge
          />
          <div>
            <div className="d-flex flex-align-items-baseline">
              <span className="fullname">{message.sender.fullName}</span>
              <span className="small">
                {message.createdAt &&
                  moment(message.createdAt).format('DD/MM/YYYY hh:mm')}
              </span>
            </div>
            <div className="chat-message-list-item--content">
              {message.message}
            </div>
          </div>
        </div>
        {showActionPanelBtn && (
          <div className="chat-message-list-item-panel">
            <button
              className="chat-message-list-item-panel-action"
              onClick={this.handleShowActionPanel}
            >
              <i className="fas fa-ellipsis-v" />
            </button>
            {showActionPanel && (
              <ActionPanel
                onDelete={this.handleDeleteMessage}
                onUpdate={this.handleUpdateMessage}
                messageId={message._id}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

MessageListItem.propTypes = {
  message: PropTypes.object.isRequired,
};

export default MessageListItem;
