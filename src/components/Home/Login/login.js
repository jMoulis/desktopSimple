import React from 'react';
import PropTypes from 'prop-types';

import './login.css';

class Login extends React.Component {
  static propTypes = {
    loginAction: PropTypes.func.isRequired,
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
    const { error, login } = loginProcess;
    return (
      <div className="form-container">
        <form id="login-form" onSubmit={this.handleSubmit}>
          <div className="form-header">
            <h1>Login</h1>
          </div>
          
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                className="form-control"
                type="text"
                name="email"
                id="email"
                value={this.state.form.email}
                placeholder="Email"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                id="password"
                value={this.state.form.password}
                placeholder="Password"
                onChange={this.handleInputChange}
              />
            </div>
            <div className="form-group">
              <button className="btn btn-form" type="submit">Sign In</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
