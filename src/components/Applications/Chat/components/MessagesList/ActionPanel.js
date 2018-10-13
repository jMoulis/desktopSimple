import React from 'react';
import PropTypes from 'prop-types';
import './actionPanel.css';

const ActionPanel = ({
  messageId,
  onUpdate,
  onDelete,
  onAnswer,
  isAllowed,
  canAnswer,
}) => {
  return (
    <ul className="action-panel">
      <li>
        {isAllowed && (
          <button type="button" onClick={() => onUpdate(messageId)}>
            Modify
          </button>
        )}
      </li>
      <li>
        {isAllowed && (
          <button type="button" onClick={() => onDelete(messageId)}>
            Delete
          </button>
        )}
      </li>
      <li>
        {canAnswer && (
          <button type="button" onClick={() => onAnswer(messageId)}>
            Answer
          </button>
        )}
      </li>
    </ul>
  );
};

ActionPanel.propTypes = {};

export default ActionPanel;
