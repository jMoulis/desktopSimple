import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Model from '../../../data/models/register-model';
import Button from '../../Form/button';
import Select from '../../Form/select';
import Input from '../../Form/input';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    let field = {};
    Object.keys(Model).map((key) => {
      field = { ...field, [key]: '' };
      return field;
    });
    this.state = {
      ...field,
    };
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { createUserAction } = this.props;
    createUserAction(evt.target);
  }
  handleInputChange = (evt) => {
    const { value, name } = evt.target;
    this.setState(() => ({
      [name]: value,
    }));
  }
  handleSelectChange = (evt) => {
    const { value, name } = evt.target;
    this.setState(() => ({
      [name]: value,
    }));
  }
  render() {
    const { createUser } = this.props;
    const { error } = createUser;
    return (
      <div id="signup" className="row justify-content-center">
        <div className="col-md-8">
          <h1>Sign up</h1>
          <form id="signup-form" className="form" onSubmit={this.handleSubmit} encType="multipart/form-data">
            <Select
              config={{
                field: Model.typeUser,
                onChange: this.handleSelectChange,
                value: this.state.typeUser,
                options: ['student', 'company'],
                error: error && error.typeUser && error.typeUser.detail,
              }}
            />
            <Input
              config={{
                field: Model.fullName,
                onChange: this.handleInputChange,
                value: this.state.fullName,
                error: error && error.fullName && error.fullName.detail,
              }}
            />
            <Input
              config={{
                field: Model.email,
                onChange: this.handleInputChange,
                value: this.state.email,
                error: error && error.email && error.email.detail,
              }}
            />
            <Input
              config={{
                field: Model.password,
                onChange: this.handleInputChange,
                value: this.state.password,
                error: error && error.password && error.password.detail,
              }}
            />
            <Button label="Create" />
          </form>
          <div>
            <p>Already have an account? <Link href="/signin" to="/signin">Sign In</Link></p>
          </div>
        </div>
      </div>
    );
  }
}
Signup.propTypes = {
  createUserAction: PropTypes.func.isRequired,
  createUser: PropTypes.object.isRequired,
};

export default Signup;
