import React from 'react';
import PropTypes from 'prop-types';

import './ressourceItem.css';

const RessourceItem = ({ config }) => {
  return (
    <li>
      <div className="ressourceItem">
        <button
          className="btn-delete"
          data-tagname={config.value}
          onClick={config.remove}
          type="button"
        >
          X
        </button>
        <img
          src={config.selectedUsers[config.value] ?
            config.selectedUsers[config.value].picture :
          '/img/anonymous.png'}
          alt="Expert"
        />
        <span className="ressource-label">{config.value}</span>
        {
          <span>
            {config.selected ?
              config.selectedUsers[config.value].fullName :
              config.counters[config.value]}
          </span>
        }
        <button
          className="btn-form search"
          type="button"
          data-filter={config.value}
          onClick={config.onClick}
        >
          {config.selected ? 'Change' : 'Search'}
        </button>
      </div>
    </li>
  );
};

RessourceItem.propTypes = {
  config: PropTypes.object.isRequired,
};

export default RessourceItem;
