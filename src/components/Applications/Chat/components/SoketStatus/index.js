import React, { Fragment } from 'react';
import './index.css';
import SocketMessage from './SocketMessage';

class SocketStatus extends React.Component {
  constructor() {
    super();
    this.timer = null;
  }

  state = {
    showOk: false,
  };

  componentDidUpdate(nextProps) {
    if (
      this.props.status.type === 'connect' &&
      nextProps.status.type === 'reconnect'
    ) {
      this.setState(() => ({
        showOk: true,
      }));
    }
  }

  renderErrorChild = ({ reconnecting }) => {
    if (reconnecting) {
      return <div>{reconnecting.message}</div>;
    }
  };

  renderReconnectSuccess = status => {
    if (status.type === 'reconnect' || status.type === 'connect') {
      this.setState(() => ({
        showOk: true,
      }));
    }
  };

  renderSuccessMessage = () => {
    setTimeout(() => this.setState(() => ({ showOk: false })), 1500);
    return (
      <SocketMessage className="socket-status socket-status-success">
        {<span>Connection success</span>}
      </SocketMessage>
    );
  };

  render() {
    const { status } = this.props;

    const { showOk } = this.state;
    return (
      <Fragment>
        {status.error ? (
          <SocketMessage className="socket-status">
            <span>Connection error</span>
            {this.renderErrorChild(status.error)}
          </SocketMessage>
        ) : (
          <Fragment>{showOk ? this.renderSuccessMessage() : null}</Fragment>
        )}
      </Fragment>
    );
  }
}

SocketStatus.propTypes = {};

export default SocketStatus;
