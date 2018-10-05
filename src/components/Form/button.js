import React from 'react';
import PropTypes from 'prop-types';

import './button.css';

/**
 * Category: normal, success, danger, warning, neutral
 * Size: large, small
 * Type: button, submit
 */

const Button = ({
  label,
  loading,
  disabled,
  type,
  small,
  category,
  children,
  onClick,
  style,
  title,
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled && true}
    style={style && style}
    className={`btn${disabled ? ' btn-disabled' : ''} btn-${category} ${
      small ? `btn-small` : ''
    }`}
    onClick={onClick}
    title={title}
    {...rest}
  >
    {children}
    {loading ? <i className="fas fa-spinner" /> : <span>{label}</span>}
  </button>
);

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.string,
  style: PropTypes.object,
};
Button.defaultProps = {
  loading: false,
  label: null,
  disabled: false,
  type: 'button',
  size: null,
  category: 'primary',
  onClick: null,
  children: null,
  style: null,
  title: null,
};

export default Button;
