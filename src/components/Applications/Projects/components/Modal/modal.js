import React from 'react';
import PropTypes from 'prop-types';
import './modal.css';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
    };
  }

  render() {
    const {
      children,
      close,
      name,
      title,
    } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { close }));

    return (
      <div className="modal-overlay">
        <div className="modal-container" style={{ width: this.state.width && this.state.width }}>
          <header className="modal-header">
            <h1>{title}</h1>
            <button name={name} type="button" className="modal-btn" onClick={close}>
              <i className="fas fa-times-circle fa-2x" />
            </button>
          </header>
          <div className="modal-content">
            {childrenWithProps}
          </div>
        </div>
      </div>
    );
  }
}

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
