import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './index.css';

class Notification extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    parentAction: PropTypes.func,
    timeout: PropTypes.number,
  };

  static defaultProps = {
    parentAction: null,
  };

  static defaultProps = {
    timeout: 1000,
  };

  state = {
    show: true,
  };

  handleClose = timeout => {
    setTimeout(() => {
      this.setState(() => ({
        show: false,
      }));
    }, timeout);
  };

  render() {
    const { message, parentAction, timeout } = this.props;
    return (
      <CSSTransition
        in={this.state.show}
        timeout={{
          enter: 300,
          exit: 200,
        }}
        classNames="info"
        appear
        unmountOnExit
        onEntered={() => this.handleClose(timeout)}
        onExited={() => {
          if (parentAction) {
            parentAction();
          }
        }}
      >
        <div className="info">
          <p>{message}</p>
        </div>
      </CSSTransition>
    );
  }
}

export default Notification;
