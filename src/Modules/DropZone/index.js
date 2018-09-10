import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const DropZone = ({ dragState, dragAction, dropAction, children }) => (
  <div
    className={`drag-drop drag-drop-${dragState}`}
    onDragEnter={evt => {
      dragAction(evt, 'enter');
    }}
    onDragOver={evt => {
      dragAction(evt, 'over');
    }}
    onDragLeave={evt => {
      dragAction(evt, 'leave');
    }}
    onDrop={dropAction}
  >
    {children}
  </div>
);

DropZone.propTypes = {
  dragState: PropTypes.string.isRequired,
  dragAction: PropTypes.func.isRequired,
  dropAction: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

DropZone.defaultProps = {
  children: null,
};

export default DropZone;
