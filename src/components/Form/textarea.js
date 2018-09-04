import React from 'react';
import PropTypes from 'prop-types';
import './textarea.css';
import SuccessIcon from '../../assets/successIcon/successIcon';

class Textarea extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
  };
  state = {
    scrollHeight: '',
  };
  componentDidMount() {
    const textarea = document.querySelector('textarea');
    this.setTextAreaHeight(textarea);
  }
  setTextAreaHeight = elt => {
    this.setState(() => ({
      scrollHeight: elt.scrollHeight,
    }));
  };
  render() {
    const { config } = this.props;
    return (
      <div className={`form-group ${config.field.required ? 'required' : ''}`}>
        <label htmlFor={config.field.name} style={{ display: 'inline-block' }}>
          {config.field.label}
        </label>
        <textarea
          type={config.field.type}
          name={config.field.name}
          id={config.field.name}
          value={config.value}
          onChange={config.onChange}
          className="form-control"
          onBlur={config.blur}
          onFocus={config.focus}
          style={{ height: this.state.scrollHeight }}
          readOnly={config.readOnly}
        />
        {config.success === config.field.name && <SuccessIcon />}
        {config.error && (
          <small className="error-message">{config.error}</small>
        )}
      </div>
    );
  }
}

export default Textarea;
