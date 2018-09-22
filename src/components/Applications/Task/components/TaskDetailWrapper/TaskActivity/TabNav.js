import React from 'react';
import PropTypes from 'prop-types';

const TabNav = ({ onClick, type }) => (
  <ul className="tab-nav">
    <li>
      <button
        className={`tab-nav-button ${
          type === 'comments' ? 'tab-nav-button-selected' : ''
        }`}
        data-type="comments"
        onClick={onClick}
      >
        Comments
      </button>
    </li>
    <li>
      <button
        className={`tab-nav-button ${
          type === 'activities' ? 'tab-nav-button-selected' : ''
        }`}
        data-type="activities"
        onClick={onClick}
      >
        Activities
      </button>
    </li>
  </ul>
);

TabNav.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
};

TabNav.defaultProps = {
  type: 'comments',
};
export default TabNav;
