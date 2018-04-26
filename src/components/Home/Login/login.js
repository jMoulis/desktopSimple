import React from 'react';
import PropTypes from 'prop-types';

import './login.css';
import ButtonLogin from '../../Form/button';
import Input from '../../Form/input';

class Login extends React.Component {
  static propTypes = {
    loginAction: PropTypes.func.isRequired,
    loginProcess: PropTypes.object.isRequired,
  }
  state = {
    form: {
      email: '',
      password: '',
    },
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { loginAction } = this.props;
    loginAction(this.state.form);
  }
  handleInputChange = (evt) => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [name]: value,
      },
    }));
  }
  render() {
    const { loginProcess } = this.props;
    const { error, logging } = loginProcess;
    return (
      <div className="form-container">
        <form id="login-form" onSubmit={this.handleSubmit}>
          <div className="form-header">
            <h1>Login</h1>
          </div>
          <div className="form-content">
            {error && <div className="error-login">{error.detail}</div>}
            <Input
              name="email"
              label="email"
              onChange={this.handleInputChange}
              value={this.state.form.email}
            />
            <Input
              name="password"
              label="Password"
              onChange={this.handleInputChange}
              value={this.state.form.password}
            />
            <div className="form-group">
              {<ButtonLogin logging={logging} />}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
