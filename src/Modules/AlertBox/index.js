import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './index.css';
import Button from '../../components/Form/button';

class AlertBox extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    buttons: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
  };
  state = {
    show: true,
  };
  handleClose = func => () => {
    this.setState(() => ({
      parentAction: func,
      show: false,
    }));
  };
  render() {
    const { title, message, buttons, type } = this.props;
    return (
      <CSSTransition
        in={this.state.show}
        timeout={{
          enter: 300,
          exit: 200,
        }}
        classNames="alert-modal"
        appear
        onExited={() => this.state.parentAction()}
        unmountOnExit
      >
        <div className={`alert-modal alert-modal-${type}`}>
          <div
            className={`alert-modal-container alert-modal-container-${type}`}
          >
            <h2 className={`alert-modal-header alert-modal-header-${type}`}>
              {title}
            </h2>
            <div className="alert-modal-content">
              <h1>{message}</h1>
              <div className="alert-modal-btn-container">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    type="button"
                    category={button.category}
                    onClick={button.action && this.handleClose(button.action)}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default AlertBox;
