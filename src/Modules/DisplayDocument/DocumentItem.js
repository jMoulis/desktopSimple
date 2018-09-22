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
  return 'alt';
};

const DocumentItem = ({ file, onClick, readOnly, onDelete }) => {
  return (
    <div className="document-item d-flex flex-column">
      {!readOnly && (
        <button
          id={file._id}
          type="button"
          className="document-item-delete"
          onClick={() => {
            onDelete(file._id || file.name);
          }}
        >
          X
        </button>
      )}
      <button
        type="button"
        className="btn-toolbar"
        onClick={() => onClick(file)}
        title={file.originalName || file.name}
      >
        <i className={`far fa-file-${extension(file.extension)} fa-3x`} />
      </button>
      <p className="document-item-infos">
        <small className="small">{file.originalName || file.name}</small>
        <small className="small">
          {moment(file.createdAt).format('DD/MM/YYYY')}
        </small>
      </p>
    </div>
  );
};

DocumentItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  file: PropTypes.object,
};

DocumentItem.defaultProps = {
  file: {},
  readOnly: false,
};

export default DocumentItem;
