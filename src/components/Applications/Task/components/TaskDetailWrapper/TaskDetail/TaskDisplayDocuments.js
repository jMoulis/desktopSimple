import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import UserIconContainer from '../../../../../../Modules/UserIcon';

const TaskDisplayDocuments = ({ documents }) => (
  <ul className="d-flex">
    {documents &&
      documents.map(document => (
        <li>
          <div className="d-flex flex-column">
            <button
              onClick={() => {
                // must use a fethAction
              }}
            >
              Link
            </button>
            <i className="fas fa-file-pdf fa-2x" />
            <small className="small">
              {document.originalName || document.name}
            </small>
            <small className="small">
              Uploaded the: {moment(document.createdAt).format('DD/MM/YYYY')}
            </small>
            <small className="small">Uploaded by:</small>
            <UserIconContainer user={{ user: document.author }} name />
          </div>
        </li>
      ))}
  </ul>
);

TaskDisplayDocuments.propTypes = {
  documents: PropTypes.array.isRequired,
};

export default TaskDisplayDocuments;
