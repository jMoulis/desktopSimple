import React from 'react';
import { Transition } from 'react-transition-group';
import PropTypes from 'prop-types';

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
};

const SocketMessage = ({ children, className }) => {
  return (
    <Transition in timeout={duration} appear>
      {state => (
        <div
          className={className}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};

SocketMessage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  className: PropTypes.string.isRequired,
};

export default SocketMessage;
