import React from 'react';
import PropTypes from 'prop-types';

import './toolbar-btn.css';

const ToolBarButton = ({ icon, onClick, type }) => (
  <button
    className={`toolbar-button ${type}`}
    onClick={onClick}
  >
    {icon && <i className={icon} />}
  </button>
);

ToolBarButton.propTypes = {
  icon: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

ToolBarButton.defaultProps = {
  icon: null,
  type: null,
  onClick: null,
};

export default ToolBarButton;
