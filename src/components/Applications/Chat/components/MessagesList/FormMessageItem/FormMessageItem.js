import React from 'react';
import PropTypes from 'prop-types';

class FormMessageItem extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
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
    const { onSubmit } = this.props;
    const { text } = this.state;
    onSubmit(text);
  };

  render() {
    const { text } = this.state;
    const { callback } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <input value={text} onChange={this.handleInputChange} />
        <button type="submit">Save</button>
        <button type="button" onClick={callback}>
          Cancel
        </button>
      </form>
    );
  }
}

export default FormMessageItem;
