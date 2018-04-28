import React from 'react';
import PropTypes from 'prop-types';
import './textarea.css';

const Textarea = ({ config }) => (
  <div className={`form-group ${config.field.required ? 'required' : ''}`}>
    <label htmlFor={config.field.name} style={{ display: 'inline-block' }}>{config.field.label}</label>
    <textarea
      type={config.field.type}
      name={config.field.name}
      id={config.field.name}
      value={config.value}
      onChange={config.onChange}
      className="form-control"
      onBlur={config.blur}
      onFocus={config.focus}
    />
    {config.error && <small>{config.error}</small>}
  </div>
);

Textarea.propTypes = {
  config: PropTypes.object.isRequired,
};

export default Textarea;
