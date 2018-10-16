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
}) => (
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

ActionPanel.propTypes = {
  messageId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAnswer: PropTypes.func.isRequired,
  isAllowed: PropTypes.bool,
  canAnswer: PropTypes.bool,
};

ActionPanel.defaultProps = {
  isAllowed: false,
  canAnswer: false,
};

export default ActionPanel;
