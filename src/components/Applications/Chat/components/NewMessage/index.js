import React, { Component } from 'react';
import './index.css';

class NewMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
  }
  handleSubmit = evt => {
    evt.preventDefault();
    this.props.onSubmit(this.state.message);
  };
  hanldeInputChange = evt => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit} className="new-message">
        <textarea
          name="message"
          value={this.state.message}
          onChange={this.hanldeInputChange}
        />
        <button type="submit">Envoyer</button>
      </form>
    );
  }
}

export default NewMessage;
