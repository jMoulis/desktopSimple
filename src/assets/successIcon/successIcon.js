import React from 'react';
import PropTypes from 'prop-types';
import successIcon from './success.svg';

const SuccessIcon = ({ style }) => (
  <img
    style={style}
    src={successIcon}
    alt="Success Icon"
  />
);

SuccessIcon.propTypes = {
  style: PropTypes.object,
};

SuccessIcon.defaultProps = {
  style: {
    position: 'absolute',
    right: '15px',
    top: '30px',
  },
};

export default SuccessIcon;

