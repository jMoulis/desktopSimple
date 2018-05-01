import React from 'react';
import PropTypes from 'prop-types';

import './account.css';
import Model from './account-model';
import Input from '../../../../../Form/input';
import Button from '../../../../../Form/button';

class AccountProfile extends React.Component {
  static propTypes = {
    userActive: PropTypes.object.isRequired,
    changePasswordAction: PropTypes.func.isRequired,
    clearMessageAction: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    let field = {};
    Object.keys(Model).map((key) => {
      field = { ...field, [key]: { value: '', focus: false, changed: false } };
      return field;
    });
    this.state = {
      ...field,
      disabled: true,
    };
    const { clearMessageAction } = props;
    clearMessageAction();
  }
  componentWillUnmount() {
    console.log('unmount');
    const { clearMessageAction } = this.props;
    clearMessageAction();
    // Maybe do someting? Like save Datas or anything else
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { changePasswordAction, userActive } = this.props;
    changePasswordAction(userActive.user._id, this.state);
    this.setState(() => ({
      actualPassword: {
        value: '',
      },
      newPassword: {
        value: '',
      },
      confirmPassword: {
        value: '',
      },
    }));
  }
  handleFormKeyPress = (evt) => {
    if (evt.key === 'Enter' && evt.target.type !== 'textarea' && evt.target.type !== 'submit') {
      evt.preventDefault();
      return false;
    }
    return true;
  }
  handleInputChange = (evt) => {
    const { value, name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        changed: true,
      },
      disabled: true,
    }));
  }
  handleOnBlur = () => {
    const { actualPassword, newPassword, confirmPassword } = this.state;
    if (actualPassword.value && actualPassword.value.length > 0 &&
        newPassword.value && newPassword.value.length > 0 &&
        confirmPassword.value && confirmPassword.value.length > 0) {
      if (confirmPassword.value === newPassword.value) {
        this.setState(() => ({
          disabled: false,
        }));
      }
      else {
        this.setState(() => ({
          error: 'Passwords Must Match',
        }));
      }
    }
  }
  render() {
    const { userActive } = this.props;
    const { loading, error, success } = userActive;
    return (
      <div id="profile" className="form-container account" key="app-content" >
        {success && <p className="success">{success}</p>}
        <form
          id="profile-form"
          className="form"
          onSubmit={this.handleSubmit}
          noValidate="true"
          onKeyPress={this.handleFormKeyPress}
        >
          <div className="profile-content-form-wrapper">
            <div className="form-content">
              <Input
                config={{
                  field: Model.actualPassword,
                  onChange: this.handleInputChange,
                  value: this.state.actualPassword.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.actualPassword && error.actualPassword.detail,
                }}
              />
              <Input
                config={{
                  field: Model.newPassword,
                  onChange: this.handleInputChange,
                  value: this.state.newPassword.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.newPassword && error.newPassword.detail,
                }}
              />
              {this.state.error && <span className="error">{this.state.error}</span>}
              <Input
                config={{
                  field: Model.confirmPassword,
                  onChange: this.handleInputChange,
                  value: this.state.confirmPassword.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.confirmPassword && error.confirmPassword.detail,
                }}
              />
              {this.state.error && <span className="error">{this.state.error}</span>}
              <Button label="Change" loading={loading} disabled={this.state.disabled} />
            </div>
            <div className="form-content">
              <h1>Other info</h1>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default AccountProfile;
