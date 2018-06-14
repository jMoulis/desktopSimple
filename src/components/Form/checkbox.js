import React from 'react';
import PropTypes from 'prop-types';
import './input.css';
import './checkbox.css';

const Checkbox = ({ config }) => {
  return (
    <div className={`form-group checkbox-group ${config.field.required ? 'required' : ''}`}>
      <label className="label" htmlFor={!config.readOnly ? config.field.name : null}>
        <div className={`custom-checkbox ${config.isFocused ? 'custom-checkbox--focus' : ''}`}>
          {config.value && <i className="fas fa-check" />}
        </div>
        <div>{config.field.label}</div>
      </label>
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
        onKeyUp={config.keyPress}
        readOnly={config.readOnly}
      />
      {config.error && <small className="error-message">{config.error}</small>}
    </div>
  );
};

Checkbox.propTypes = {
  config: PropTypes.shape({
    value: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default Checkbox;
