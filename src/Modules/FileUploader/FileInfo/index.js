import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './index.css';

const FileInfo = ({ doc }) => (
  <div className="file-info">
    <small className="small">{doc.originalName || doc.name}</small>
    <small className="small">
      {moment(doc.createdAt).format('DD/MM/YYYY')}
    </small>
    <small className="small">{doc.author.fullName}</small>
  </div>
);

FileInfo.propTypes = {
  doc: PropTypes.object.isRequired,
};

export default FileInfo;
