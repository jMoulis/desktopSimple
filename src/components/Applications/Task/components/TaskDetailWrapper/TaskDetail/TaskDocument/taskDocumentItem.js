import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UserIconContainer from '../../../../../../../Modules/UserIcon';
import './index.css';

const TaskDocumentItem = ({ onClick, document }) => (
  <div className="document-item d-flex flex-column">
    <button
      type="button"
      className="btn-toolbar"
      onClick={onClick}
      data-url={document.url}
      data-filename={document.originalName || document.name}
      title={document.originalName || document.name}
    >
      <i className="fas fa-file-pdf fa-3x" />
    </button>
    <small className="small">{document.originalName || document.name}</small>
    <small className="small">
      {moment(document.createdAt).format('DD/MM/YYYY')}
    </small>
    <UserIconContainer user={{ user: document.author }} />
  </div>
);

TaskDocumentItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  document: PropTypes.object,
};

TaskDocumentItem.defaultProps = {
  document: {},
};

export default TaskDocumentItem;
