import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UserIconContainer from '../../../../../../Modules/UserIcon';
import FormMessageItem from '../FormMessageItem/FormMessageItem';
import ActionPanel from '../ActionPanel';

class MessageTemp extends Component {
  static propTypes = {
    message: PropTypes.object.isRequired,
    loggedUser: PropTypes.object.isRequired,
    socketActionType: PropTypes.string.isRequired,
    callbacks: PropTypes.object.isRequired,
    canAnswer: PropTypes.bool,
  };
  static defaultProps = {
    canAnswer: false,
  };
  state = {
    showInputChange: false,
    showActionPanelBtn: false,
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

  handleUpdateMessage = messageId => {
    this.setState(() => ({
      showInputChange: true,
      messageId,
    }));
  };

  handleHideForm = () => {
    this.setState(() => ({
      showInputChange: false,
    }));
  };

  handleShowReplyForm = messageId => {
    this.setState(() => ({
      showReplyForm: true,
      messageId,
    }));
  };

  render() {
    const {
      message,
      loggedUser,
      socketActionType,
      callbacks,
      canAnswer,
    } = this.props;
    const { showInputChange, showActionPanelBtn, showActionPanel } = this.state;
    return (
      <div
        className="chat-message-list-item--header"
        onMouseEnter={this.handleDisplayActionMenuBtn}
        onMouseLeave={this.handleDisplayActionMenuBtn}
      >
        <div className="d-flex">
          <UserIconContainer
            user={{ user: message.sender }}
            hideNotificationBadge
          />
          <div className="chat-message-list-item--content">
            {showInputChange ? (
              <FormMessageItem
                value={message.message}
                onSubmit={text => {
                  callbacks.onSubmit({ text, socketActionType, message });
                  this.handleHideForm();
                }}
                callback={this.handleHideForm}
              />
            ) : (
              <Fragment>
                <div className="d-flex flex-align-items-baseline">
                  <span className="fullname">{message.sender.fullName}</span>
                  <span className="small">
                    {message.createdAt &&
                      moment(message.createdAt).format('DD/MM/YYYY hh:mm')}
                  </span>
                </div>
                {message.message}
              </Fragment>
            )}
          </div>
        </div>
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
                onDelete={callbacks.onDelete}
                onUpdate={this.handleUpdateMessage}
                onAnswer={callbacks.showReplyAction}
                canAnswer={canAnswer}
                messageId={message._id}
                isAllowed={loggedUser._id === message.sender._id}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default MessageTemp;
