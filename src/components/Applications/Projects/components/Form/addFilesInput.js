import React from 'react';
import PropTypes from 'prop-types';

const AddFilesInput = ({
  docs,
  onRemove,
  onFileChange,
  error,
}) => (
  <div className="form-group">
    <label>Documents</label>
    <div className="thumbnail-wrapper">
      <label htmlFor="docs">
        <div className="add-thumbnail">
          <i className="fas fa-plus-circle fa-3x" />
        </div>
      </label>
      <input
        type="file"
        hidden
        name="docs"
        id="docs"
        accept=".pdf"
        onChange={onFileChange}
      />
      {docs.map((doc, index) => (
        <div key={index} className="thumbnail">
          <button
            id={index}
            type="button"
            className="delete-thumbnail"
            onClick={onRemove}
          >X
          </button>
          <canvas id={`canvas-${index}`} />
        </div>
      ))}
    </div>
    {error && <small>{error}</small>}
  </div>
);

AddFilesInput.propTypes = {
  docs: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
  onFileChange: PropTypes.func.isRequired,
  error: PropTypes.object,
};

AddFilesInput.defaultProps = {
  error: null,
};

export default AddFilesInput;
