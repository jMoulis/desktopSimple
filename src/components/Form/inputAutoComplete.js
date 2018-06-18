import React from 'react';
import PropTypes from 'prop-types';
import './inputAutoComplete.css';
import SuccessIcon from '../../assets/successIcon/successIcon';

const InputAutoComplete = ({ config }) => {
  return (
    <div className={`form-group ${config.field.required ? 'required' : ''}`}>
      <label htmlFor={config.field.name}>{config.field.label}</label>
      <div className={config.isFocused ? 'input-auto input-auto--focus' : 'input-auto'}>
        {config.values && config.values.map((value, index) => (
          <div className="input-auto-values" key={index}>
            <span className="input-auto-value">{value}</span>
            {!config.readOnly && <button id={index} type="button" onClick={config.remove}>X</button>}
          </div>
        ))}
        {!config.readOnly &&
          <input
            type={config.field.type}
            name={config.field.name}
            id={config.field.name}
            value={config.value}
            onChange={config.onChange}
            className="form-control"
            onBlur={config.blur}
            onFocus={config.focus}
            onKeyUp={config.keyPress}
            placeholder={config.field.placeholder}
            readOnly={config.readOnly}
          />
        }
      </div>
      {config.success && config.success === config.field.name && <SuccessIcon />}
      {config.small && <small className="tips">{config.small}</small>}
      {config.error && <small className="error-message">{config.error}</small>}
    </div>
  );
};

InputAutoComplete.propTypes = {
  config: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default InputAutoComplete;
