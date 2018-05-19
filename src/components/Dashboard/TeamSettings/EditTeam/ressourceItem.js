import React from 'react';
import PropTypes from 'prop-types';

import './ressourceItem.css';

const hasPicture = (user) => {
  if (!user) {
    return '/img/anonymous.png';
  }
  if (user.picture) {
    if (user.picture.length > 0) {
      return user.picture;
    }
  }
  return '/img/avatar.png';
};
const RessourceItem = ({ config }) => {
  return (
    <li data-name={config.value}>
      <div
        className={
          `ressource-item ${config.specAlreadySelected === config.value &&
            'ressource-item-already-selected'}`
        }
      >
        <button
          className="btn-delete"
          data-tagname={config.value}
          onClick={config.remove}
          type="button"
        >
          X
        </button>
        <img
          src={hasPicture(config.selectedUsers[config.value])}
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
