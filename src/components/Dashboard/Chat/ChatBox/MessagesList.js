import React from 'react';
import PropTypes from 'prop-types';

class MessagesList extends React.Component {
  static propTypes = {};
  constructor(props) {
    super(props);
    this.messagesList = React.createRef();
  }
  componentDidMount() {
    this.scrollToBottom(this.messagesList.current);
  }

  componentDidUpdate() {
    this.scrollToBottom(this.messagesList.current);
  }

  scrollToBottom = element => {
    element.scrollTop = element.scrollHeight;
  };
  render() {
    const { room } = this.props;
    return (
      <ul
        ref={this.messagesList}
        className="chatbox-messages-list"
        style={{
          height: '250px',
          overflow: 'auto',
          padding: '1rem',
        }}
      >
        {room.messages.map(({ _id, message }) => (
          <li className="chatbox-messages-list-item" key={_id}>
            {message}
          </li>
        ))}
      </ul>
    );
  }
}

export default MessagesList;
