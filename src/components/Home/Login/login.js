import React from 'react';
import PropTypes from 'prop-types';

import './login.css';
import Button from '../../Form/button';
import Input from '../../Form/input';
import Model from '../../../data/models/login-model';

class Login extends React.Component {
  static propTypes = {
    loginAction: PropTypes.func.isRequired,
    clearMessageAction: PropTypes.func.isRequired,
    loginProcess: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    let field = {};
    Object.keys(Model).map(key => {
      field = {
        ...field,
        [key]: {
          value: '',
          focus: false,
          changed: false,
        },
      };
      return field;
    });
    this.state = field;
  }
  componentWillUnmount() {
    const { clearMessageAction } = this.props;
    clearMessageAction();
  }
  handleSubmit = evt => {
    evt.preventDefault();
    const { loginAction } = this.props;
    loginAction(this.state);
  };
  handleFormKeyPress = evt => {
    if (
      evt.key === 'Enter' &&
      evt.target.type !== 'textarea' &&
      evt.target.type !== 'submit'
    ) {
      evt.preventDefault();
      return false;
    }
    return true;
  };
  handleInputChange = evt => {
    const { name, value } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        value,
        focus: true,
        changed: true,
      },
    }));
  };
  render() {
    const { loginProcess } = this.props;
    const { logging, error } = loginProcess;

    return (
      <div id="signin-form" className="form-container">
        <form
          className="form"
          onSubmit={this.handleSubmit}
          onKeyPress={this.handleFormKeyPress}
        >
          <div className="form-header">
            <h1>Sign In</h1>
          </div>
          <div className="form-content">
            {error && <div className="error-message">{error.detail}</div>}
            <Input
              config={{
                field: Model.email,
                onChange: this.handleInputChange,
                value: this.state.email.value,
              }}
            />
            <Input
              config={{
                field: Model.password,
                onChange: this.handleInputChange,
                value: this.state.password.value,
              }}
            />
            <div className="form-group">
              {
                <Button
                  type="submit"
                  category="primary"
                  loading={logging}
                  label="Sign In"
                />
              }
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
