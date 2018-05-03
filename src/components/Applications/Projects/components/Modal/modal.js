import React from 'react';
import PropTypes from 'prop-types';
import './modal.css';

const Modal = ({
  children,
  close,
  name,
  title,
}) => (
  <div className="modal-overlay">
    <div className="modal-container">
      <header className="modal-header">
        <h1>{title}</h1>
        <button name={name} type="button" className="modal-btn" onClick={close} />
      </header>
      <div className="modal-content">
        {children}
      </div>
    </div>
  </div>
);

Modal.propTypes = {
  close: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.array,
  ]),
};

Modal.defaultProps = {
  children: null,
};

export default Modal;
