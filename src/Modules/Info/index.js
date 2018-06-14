import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './index.css';

class Info extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    parentAction: PropTypes.func.isRequired,
  }
  state = {
    show: true,
  }
  handleClose = () => {
    setTimeout(() => {
      this.setState(() => ({
        show: false,
      }));
    }, 1000);
  }
  render() {
    const { message, parentAction } = this.props;
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
        onEntered={() => this.handleClose()}
        onExited={() => parentAction()}
      >
        <div className="info">
          <p>{message}</p>
        </div>
      </CSSTransition>
    );
  }
}

export default Info;
