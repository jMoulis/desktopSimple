import React from 'react';
import PropTypes from 'prop-types';

class FormMessageItem extends React.Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    room: PropTypes.object.isRequired,
    typeSocketAction: PropTypes.string.isRequired,
    loggedUser: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
    callback: PropTypes.func.isRequired,
    stateParentKey: PropTypes.string.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    value: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      text: props.value || '',
    };
  }

  handleInputChange = evt => {
    const { value } = evt.target;
    this.setState(() => ({
      text: value,
    }));
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const {
      socket,
      room,
      typeSocketAction,
      loggedUser,
      message,
      callback,
      stateParentKey,
    } = this.props;
    const { text } = this.state;
    socket.emit(typeSocketAction, {
      room,
      message: text,
      messageId: message._id,
      sender: {
        _id: loggedUser._id,
        fullName: loggedUser.fullName,
        picture: loggedUser.picture,
      },
    });
    callback(stateParentKey);
  };

  handleCancel = () => {
    const { callback, stateParentKey } = this.props;
    callback(stateParentKey);
    this.setState(() => ({
      text: this.props.value,
    }));
  };

  render() {
    const { text } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input value={text} onChange={this.handleInputChange} />
        <button type="submit">Save</button>
        <button type="button" onClick={this.handleCancel}>
          Cancel
        </button>
      </form>
    );
  }
}

export default FormMessageItem;
