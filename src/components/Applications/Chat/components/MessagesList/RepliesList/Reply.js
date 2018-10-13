import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from '../Message';
import ActionPanel from '../ActionPanel';

class Reply extends Component {
  state = {
    showActionPanel: false,
    showActionPanelBtn: false,
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
    const { socket, room } = this.props;
    socket.emit('REPLY_DELETE', {
      room,
      messageId,
    });
  };

  handleHideForm = () => {
    this.setState(() => ({
      showInputChange: false,
    }));
  };

  handleUpdateMessage = messageId => {
    this.setState(() => ({
      showInputChange: true,
      messageId,
    }));
  };

  render() {
    const { reply, socket, room, loggedUser } = this.props;
    const { showActionPanelBtn, showActionPanel, showInputChange } = this.state;
    return (
      <div
        className="d-flex flex-justify-between flex-align-items-center"
        onMouseEnter={this.handleDisplayActionMenuBtn}
        onMouseLeave={this.handleDisplayActionMenuBtn}
      >
        <Message
          message={reply}
          socket={socket}
          room={room}
          loggedUser={loggedUser}
          callback={this.handleHideForm}
          canAnswer={false}
          showInputChange={showInputChange}
          typeSocketAction="REPLY_UPDATE"
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
                messageId={reply._id}
                isAllowed={loggedUser._id === reply.sender._id}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

Reply.propTypes = {};

export default Reply;
