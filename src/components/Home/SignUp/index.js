import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './signup.css';
import Model from '../../../data/models/register-model';
import Button from '../../Form/button';
import Select from '../../Form/select';
import Input from '../../Form/input';

class Signup extends React.Component {
  static propTypes = {
    createUserAction: PropTypes.func.isRequired,
    clearMessageAction: PropTypes.func.isRequired,
    createUserProcess: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    let field = {};
    Object.keys(Model).map(key => {
      field = { ...field, [key]: '' };
      return field;
    });
    this.state = {
      ...field,
    };
  }
  componentWillUnmount() {
    const { clearMessageAction } = this.props;
    clearMessageAction();
  }
  handleSubmit = evt => {
    evt.preventDefault();
    const { createUserAction } = this.props;
    createUserAction(evt.target);
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
    const { value, name } = evt.target;
    this.setState(() => ({
      [name]: value,
    }));
  };
  handleSelectChange = evt => {
    const { value, name } = evt.target;
    this.setState(() => ({
      [name]: value,
    }));
  };
  render() {
    const { createUserProcess } = this.props;
    const { error, creating } = createUserProcess;
    return (
      <div id="signup" className="form-container">
        <form
          id="signup-form"
          className="form"
          onSubmit={this.handleSubmit}
          encType="multipart/form-data"
          onKeyPress={this.handleFormKeyPress}
        >
          <div className="form-header">
            <h1>Sign Up</h1>
          </div>
          <div className="form-content">
            {error && <div className="error-login">{error.detail}</div>}
            <Select
              config={{
                name: Model.typeUser.name,
                field: Model.typeUser,
                onChange: this.handleSelectChange,
                value: this.state.typeUser,
                options: ['student', 'company'],
                required: Model.typeUser.required,
                error: error && error.typeUser && error.typeUser.detail,
              }}
            />
            <Input
              config={{
                label: Model.fullName.label,
                type: 'text',
                field: Model.fullName,
                name: Model.fullName.name,
                onChange: this.handleInputChange,
                value: this.state.fullName,
                required: Model.fullName.required,
                error: error && error.fullName && error.fullName.detail,
              }}
            />
            <Input
              config={{
                label: Model.email.label,
                type: 'text',
                field: Model.email,
                name: Model.email.name,
                onChange: this.handleInputChange,
                value: this.state.email,
                required: Model.email.required,
                error: error && error.email && error.email.detail,
              }}
            />
            <Input
              config={{
                label: Model.password.label,
                type: 'password',
                field: Model.password,
                name: Model.password.name,
                onChange: this.handleInputChange,
                value: this.state.password,
                required: Model.password.required,
                error: error && error.password && error.password.detail,
              }}
            />
            <div className="form-group">
              <Button
                type="submit"
                category="primary"
                label="Sign Up"
                loading={creating}
              />
            </div>
          </div>
        </form>
        <div>
          <p>
            Already have an account?{' '}
            <Link href="/signin" to="/signin">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

export default Signup;
