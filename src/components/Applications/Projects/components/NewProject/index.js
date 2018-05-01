import React from 'react';
import PropTypes from 'prop-types';

import './newProject.css';
import Model from './project-model';
import Input from '../../../../Form/input';
import Button from '../../../../Form/button';
import Textarea from '../../../../Form/textarea';
import InputAutoComplete from '../../../../Form/inputAutoComplete';
import autoTextAreaResizing from '../../../../../Utils/autoTextAreaResizing';
import Checkbox from '../../../../Form/checkbox';

class NewProject extends React.Component {
  static propTypes = {
    projectCreation: PropTypes.object.isRequired,
    createProjectAction: PropTypes.func.isRequired,
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
      isContest: false,
      isPrice: false,
    };
  }
  componentWillUnmount() {
    console.log('unmount');
    // Maybe do someting? Like save Datas or anything else
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { createProjectAction } = this.props;
    return createProjectAction(this.state);
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
    return this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        changed: true,
      },
    }));
  }
  handleTextAreaChange = (evt) => {
    const { value, name } = evt.target;
    autoTextAreaResizing(evt.target);
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        changed: true,
      },
    }));
  }
  handleCheckBoxChange = (evt) => {
    const { name, checked } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: checked,
        changed: true,
      },
    }));
  }
  handleInputSelectCompetencesChange = (evt) => {
    const { value } = evt.target;
    if (evt.keyCode === 13 || evt.keyCode === 32 || evt.keyCode === 188) {
      const { state } = this;
      this.setState(() => ({
        ...state,
        tags: {
          ...state.tags,
          value: [
            ...state.tags.value,
            value,
          ],
          changed: true,
        },
      }));

      evt.target.value = '';
    }
  }
  render() {
    const { projectCreation } = this.props;
    const { error, success } = projectCreation;
    return (
      <div id="profile" className="form-container" key="app-content" >
        {success && <p className="success">{success}</p>}
        <form
          id="profile-form"
          className="form"
          onKeyPress={this.handleFormKeyPress}
          onSubmit={this.handleSubmit}
          noValidate="true"
        >
          <div className="form-content-wrapper">
            <div className="form-content">
              <Input
                config={{
                  field: Model.title,
                  onChange: this.handleInputChange,
                  value: this.state.title.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  keyPress: this.handleInputChange,
                  error: error && error.title && error.title.detail,
                }}
              />
              <Textarea
                config={{
                  field: Model.description,
                  onChange: this.handleTextAreaChange,
                  value: this.state.description.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.description && error.description.detail,
                }}
              />
              <Input
                config={{
                  field: Model.dueDate,
                  onChange: this.handleInputChange,
                  value: this.state.dueDate.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  keyPress: this.handleInputChange,
                  error: error && error.dueDate && error.dueDate.detail,
                }}
              />
              <Input
                config={{
                  field: Model.maxTeam,
                  onChange: this.handleInputChange,
                  value: this.state.maxTeam.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  keyPress: this.handleInputChange,
                  error: error && error.maxTeam && error.maxTeam.detail,
                }}
              />
              <Checkbox
                config={{
                  field: Model.isPrice,
                  onChange: this.handleCheckBoxChange,
                  value: this.state.isPrice.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.isPrice && error.isPrice.detail,
                }}
              />
              <Input
                config={{
                  field: Model.price,
                  onChange: this.handleInputChange,
                  value: this.state.price.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  keyPress: this.handleInputChange,
                  error: error && error.price && error.price.detail,
                }}
              />
              <Checkbox
                config={{
                  field: Model.isContest,
                  onChange: this.handleCheckBoxChange,
                  value: this.state.isContest.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.isContest && error.isContest.detail,
                }}
              />
              <InputAutoComplete
                config={{
                  field: Model.tags,
                  onChange: this.handleInputSelectCompetencesChange,
                  keyPress: this.handleInputSelectCompetencesChange,
                  values: this.state.tags.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.tags && error.tags.detail,
                }}
              />
              <Button label="Create" loading={false} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default NewProject;
