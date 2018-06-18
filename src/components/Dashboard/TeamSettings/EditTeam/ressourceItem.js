import React from 'react';
import PropTypes from 'prop-types';

import UserIcon from '../../../../Modules/UserIcon';
import './ressourceItem.css';

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
        <UserIcon user={{
          user: config.selectedUsers[config.value],
        }}
        />
        <span className="ressource-label">{config.value}</span>
        {
          <span>
            {config.selected && config.selectedUsers[config.value] ?
              config.selectedUsers[config.value].fullName :
              config.counters[config.value]}
          </span>
        }
        <button
          className="btn btn-primary"
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
