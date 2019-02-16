import React from 'react';
import PropTypes from 'prop-types';

const AuthContext = React.createContext({
  simon: null,
});

class AuthProvider extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
      .isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      simon: 'test',
    };
  }
  componentDidMount() {}

  render() {
    const { children } = this.props;
    return (
      <AuthContext.Provider value={{ ...this.state }}>
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;

export const withAuth = Component => props => {
  return (
    <AuthContext.Consumer>
      <Component {...props} {...props}>
        {props.children}
      </Component>
    </AuthContext.Consumer>
  );
};
