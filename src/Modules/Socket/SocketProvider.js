import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

import SocketActions from './socketActions';

const SocketContext = React.createContext({
  socketProvider: null,
});

const ROOT_URL = process.env.REACT_APP_API;

class SocketProvider extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
      .isRequired,
  };

  constructor(props) {
    super(props);
    const userID = JSON.parse(localStorage.getItem('user'));
    this.socket = io(`${ROOT_URL}`, {
      multiplex: false,
      query: {
        userId: userID._id,
      },
    });

    this.state = {
      socketProvider: {
        socket: this.socket,
        socketActions: new SocketActions(this.socket),
        socketStatus: {
          type: null,
          message: null,
          error: {
            reconnecting: {
              status: false,
              message: '',
            },
          },
        },
      },
    };

    this.socket.on('connect', () => {
      console.log('Connected');
      this.handleStatusSocket({
        type: 'connect',
        message: 'You are connected',
        error: null,
      });
    });

    this.socket.on('connect_error', () => {
      // const { emptyConnectedUserListAction } = this.props;
      // emptyConnectedUserListAction();
      this.handleStatusSocket({
        error: {
          type: 'connect_error',
          message: 'Chat connexion failed',
        },
      });
    });
    this.socket.on('reconnecting', () => {
      this.handleStatusSocket({
        error: {
          reconnecting: {
            status: true,
            message: 'We are trying to reconnect you',
          },
        },
      });
    });
    this.socket.on('reconnect', () => {
      this.handleStatusSocket({
        socketStatus: {
          type: 'reconnect',
          message: 'Chat reconnexion successfull',
        },
      });
    });
    this.socket.on('reconnect_failed', () => {
      this.handleStatusSocket({
        error: {
          type: 'reconnect_failed',
          message: 'Reconnection failed. Check your internet connexion',
          reconnecting: {
            status: false,
            message: 'Reconnection failed. Check your internet connexion',
          },
        },
      });
    });
  }
  componentDidMount() {}

  handleStatusSocket = socketStatus => {
    this.setState(prevState => ({
      ...prevState,
      socketProvider: {
        ...prevState.socketProvider,
        socketStatus,
      },
    }));
  };

  render() {
    const { children } = this.props;
    return (
      <SocketContext.Provider value={{ ...this.state }}>
        {children}
      </SocketContext.Provider>
    );
  }
}

export default SocketProvider;

export const withSocket = Component => props => (
  <SocketContext.Consumer>
    {socketProvider => (
      <Component {...props} {...socketProvider}>
        {props.children}
      </Component>
    )}
  </SocketContext.Consumer>
);
