import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import './modal.css';

class Modal extends React.Component {
  static propTypes = {
    closeFromParent: PropTypes.func,
    zIndex: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
      PropTypes.array,
    ]),
    name: PropTypes.string,
  };
  static defaultProps = {
    children: null,
    closeFromParent: null,
    name: '',
  };
  constructor(props) {
    super(props);
    this.state = {
      style: null,
      enterTimeout: 150,
      exitTimeout: 150,
      display: true,
    };
  }
  componentDidMount() {
    this.setWidth();
  }
  setWidth = () => {
    if (this.props.small) {
      this.setState(prevState => ({
        ...prevState,
        style: {
          width: '50%',
          minWidth: '50%',
          height: '70%',
          margin: '4rem',
        },
      }));
    }
  };
  handleClose = () => {
    this.setState(prevState => ({
      ...prevState,
      display: false,
    }));
    return true;
  };
  render() {
    const {
      children,
      closeFromParent,
      name,
      title,
      zIndex,
      small,
    } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { closeFromParent }),
    );

    return (
      <CSSTransition
        in={this.state.display}
        timeout={{
          enter: this.state.enterTimeout,
          exit: this.state.exitTimeout,
        }}
        classNames="modal-overlay"
        appear
        onExited={() => closeFromParent(name)}
      >
        <div className="modal-overlay" style={{ zIndex }}>
          <div
            className="modal-container"
            style={small ? this.state.style : {}}
          >
            <header className="modal-header">
              <h1>{title}</h1>
              <button
                name={name}
                type="button"
                className="modal-btn"
                onClick={this.handleClose}
              >
                <i className="fas fa-times-circle fa-2x" />
              </button>
            </header>
            <div className="modal-content">{childrenWithProps}</div>
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default Modal;
