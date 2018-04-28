import React from 'react';
import PropTypes from 'prop-types';
import './input.css';

const Input = ({ config }) => (
  <div className={`form-group ${config.field.required ? 'required' : ''}`}>
    <label htmlFor={config.field.name}>{config.field.label}</label>
    <input
      type={config.field.type}
      name={config.field.name}
      id={config.field.name}
      value={config.value}
      placeholder={config.field.label}
      onChange={config.onChange}
      className="form-control"
      onBlur={config.blur}
      onFocus={config.focus}
    />
    {config.error && <small>{config.error}</small>}
  </div>
);

Input.propTypes = {
  config: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default Input;
