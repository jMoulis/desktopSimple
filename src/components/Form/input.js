import React from 'react';
import PropTypes from 'prop-types';
import './input.css';

const Input = ({ config }) => {
  return (
    <div className={`form-group ${config.field.required ? 'required' : ''}`}>
      <label htmlFor={config.field.name}>{config.field.label}</label>
      <input
        type={config.field.type}
        name={config.field.name}
        id={config.field.name}
        value={config.value || ''}
        placeholder={config.field.placeholder ? config.field.placeholder : config.field.label}
        onChange={config.onChange}
        className={`form-control ${config.error && 'form-control-error'}`}
        onBlur={config.blur}
        onFocus={config.focus}
        onKeyUp={config.keyUp}
        readOnly={config.readOnly}
        onKeyPress={config.keyPress}
      />
      {config.small && <small className="tips">{config.small}</small>}
      {config.error && <small className="error-message">{config.error}</small>}
    </div>
  );
};

Input.propTypes = {
  config: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default Input;
