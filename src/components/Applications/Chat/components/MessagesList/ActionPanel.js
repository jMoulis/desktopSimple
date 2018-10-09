import React from 'react';
import PropTypes from 'prop-types';
import './actionPanel.css';

const ActionPanel = ({ messageId, onUpdate, onDelete }) => {
  return (
    <ul className="action-panel">
      <li>
        <button onClick={() => onUpdate(messageId)}>Modify</button>
      </li>
      <li>
        <button onClick={() => onDelete(messageId)}>Delete</button>
      </li>
    </ul>
  );
};

ActionPanel.propTypes = {};

export default ActionPanel;
