import React from 'react';
import PropTypes from 'prop-types';

import UserIcon from '../UserIcon';
import './ressourceItem.css';
import Button from '../../components/Form/button';

const RessourceItem = ({ config }) => (
  <li data-name={config.value}>
    <div
      className={`ressource-item ${config.specAlreadySelected ===
        config.value && 'ressource-item-already-selected'}`}
    >
      <button
        className="btn-delete"
        data-tagname={config.value}
        onClick={config.remove}
        type="button"
      >
        X
      </button>
      {!config.selectedUsers[config.value] && (
        <img src="/img/anonymous.png" alt="expert" />
      )}
      <UserIcon
        user={{
          user: config.selectedUsers[config.value],
        }}
        classCss="big"
      />
      <span className="ressource-label">{config.value}</span>
      {
        <span>
          {config.selected && config.selectedUsers[config.value]
            ? config.selectedUsers[config.value].fullName
            : config.counters[config.value]}
        </span>
      }
      <Button
        type="button"
        category="primary"
        id="btn-search"
        onClick={() => {
          config.onClick(config.value);
        }}
        disabled={config.counters[config.value] === 0}
      >
        {config.selected ? 'Change' : 'Search'}
      </Button>
    </div>
  </li>
);

RessourceItem.propTypes = {
  config: PropTypes.object.isRequired,
};

export default RessourceItem;
