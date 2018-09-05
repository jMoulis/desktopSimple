import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './index.css';

const extension = ext => {
  const word = ['doc', 'docx', 'odt', 'ott'];
  const excel = ['xls', 'xlsx', 'ods', 'ots'];
  const powerpoint = ['ppt', 'pptx', 'odp', 'otp'];
  const image = ['jpeg', 'png', 'gif', 'jpg'];
  if (!ext) return 'alt';
  if (word.includes(ext)) return 'word';
  if (excel.includes(ext)) return 'excel';
  if (powerpoint.includes(ext)) return 'powerpoint';
  if (image.includes(ext)) return 'image';
  return ext;
};

const TaskDocumentItem = ({ onClick, document }) => {
  return (
    <div className="document-item d-flex flex-column">
      <button
        type="button"
        className="btn-toolbar"
        onClick={onClick}
        data-url={document.url}
        data-filename={document.originalName || document.name}
        title={document.originalName || document.name}
      >
        <i className={`far fa-file-${extension(document.extension)} fa-3x`} />
      </button>
      <small className="small">{document.originalName || document.name}</small>
      <small className="small">
        {moment(document.createdAt).format('DD/MM/YYYY')}
      </small>
    </div>
  );
};

TaskDocumentItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  document: PropTypes.object,
};

TaskDocumentItem.defaultProps = {
  document: {},
};

export default TaskDocumentItem;
