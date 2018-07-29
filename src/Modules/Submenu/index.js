import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const SubMenu = ({ menus }) => (
  <div className="sub-menu">
    <ul className="sub-menu-list">
      {menus.map((menu, index) => (
        <li key={index} className="sub-menu-list-item">
          <button
            className="sub-menu-list-item-btn"
            name={menu.name}
            onClick={menu.action}
            disabled={menu.disabled}
          >
            {menu.label}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

SubMenu.propTypes = {
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      action: PropTypes.func,
      disabled: PropTypes.bool,
      name: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

export default SubMenu;
