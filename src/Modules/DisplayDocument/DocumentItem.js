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

const DocumentItem = ({ document, onClick, readOnly, onDelete }) => {
  console.log(document);
  return (
    <div className="document-item d-flex flex-column">
      {!readOnly && (
        <button
          id={document._id}
          type="button"
          className="document-item-delete"
          onClick={() => {
            onDelete(document._id || document.name);
          }}
        >
          X
        </button>
      )}
      <button
        type="button"
        className="btn-toolbar"
        onClick={() => onClick(document)}
        title={document.originalName || document.name}
      >
        <i className={`far fa-file-${extension(document.extension)} fa-3x`} />
      </button>
      <p className="document-item-infos">
        <small className="small">
          {document.originalName || document.name}
        </small>
        <small className="small">
          {moment(document.createdAt).format('DD/MM/YYYY')}
        </small>
      </p>
    </div>
  );
};

DocumentItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  document: PropTypes.object,
};

DocumentItem.defaultProps = {
  document: {},
  readOnly: false,
};

export default DocumentItem;
