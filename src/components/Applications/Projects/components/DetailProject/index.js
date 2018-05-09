import React from 'react';
import PropTypes from 'prop-types';

import Model from '../Model/project-model';
import Input from '../../../../Form/input';
import Textarea from '../../../../Form/textarea';
import InputAutoComplete from '../../../../Form/inputAutoComplete';
import autoTextAreaResizing from '../../../../../Utils/autoTextAreaResizing';
import Checkbox from '../../../../Form/checkbox';
import InfoPanel from '../../containers/DetailProject/InfoPanel';
import AddFilesInput from '../Form/addFilesInput';

class DetailProject extends React.Component {
  static propTypes = {
    activeProjectProcess: PropTypes.object.isRequired,
    editProjectAction: PropTypes.func.isRequired,
    selectTab: PropTypes.func.isRequired,
  }
  static getDerivedStateFromProps(nextProps) {
    const { activeProjectProcess } = nextProps;
    const { project } = activeProjectProcess;
    let field = {};
    Object.keys(Model).map((key) => {
      field = { ...field, [key]: project ? { value: project[key], focus: false, changed: false } : { value: '', focus: false, changed: false } };
      return field;
    });
    return {
      ...field,
    };
  }
  state = {}

  componentDidUpdate(prevProps, prevState) {
    const { editProjectAction } = prevProps;
    // Dealing with documents
    if (prevState.docs.value) {
      if (prevState.docs.value.length !== this.state.docs.value.length) {
        editProjectAction(this.state);
      }
    }
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { editProjectAction } = this.props;
    editProjectAction(this.state);
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
  handleRemove = (evt) => {
    evt.preventDefault();
    const { editProjectAction } = this.props;
    const { state } = this;
    const values = state.tags.value.filter((value, index) => (
      index !== Number(evt.target.id)
    ));
    const newTags = {
      ...state,
      tags: {
        ...state.tags,
        value: values,
        changed: true,
      },
    };
    this.setState(prevState => ({
      ...prevState,
      tags: {
        ...state.tags,
        value: values,
        changed: true,
      },
    }));
    editProjectAction(newTags);
  }
  handleInputSelectTagsChange = (evt) => {
    const inputValue = evt.target.value;
    const { editProjectAction } = this.props;
    if (evt.keyCode === 13 || evt.keyCode === 32 || evt.keyCode === 188) {
      const { state } = this;
      const newTags = {
        ...state,
        tags: {
          ...state.tags,
          value: [
            ...state.tags.value,
            inputValue,
          ],
          changed: true,
        },
      };
      this.setState(prevState => ({
        ...prevState,
        tags: {
          ...state.tags,
          value: [
            ...state.tags.value,
            inputValue,
          ],
          changed: true,
        },
      }));
      editProjectAction(newTags);
      evt.target.value = '';
    }
  }
  handleOnBlur = (evt) => {
    // Save the input field
    const { name } = evt.target;
    const { editProjectAction } = this.props;
    if (this.state[name].changed) {
      editProjectAction(this.state);
    }
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        focus: false,
        changed: false,
      },
    }));
  }
  handleOnFocus = (evt) => {
    // Save the input field
    const { name } = evt.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        focus: true,
      },
    }));
  }
  handleInputFileChange = (docs) => {
    this.setState(prevState => ({
      ...prevState,
      docs: {
        value: docs,
        changed: true,
      },
    }));
  }
  render() {
    const { activeProjectProcess, selectTab } = this.props;
    const { error, loading, project } = activeProjectProcess;
    if (loading || Object.keys(project).length === 0) {
      return <span>loading</span>;
    }
    return (
      <div id="edit-project" className="form-container" key="app-content" >
        <form
          id="edit-project-form"
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
                  value: new Date(this.state.dueDate.value).toISOString().substring(0, 10),
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  keyPress: this.handleInputChange,
                  error: error && error.dueDate && error.dueDate.detail,
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
              {this.state.isPrice.value &&
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
              }
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
              {this.state.isContest.value &&
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
              }
              <InputAutoComplete
                config={{
                  field: Model.tags,
                  onChange: this.handleInputSelectTagsChange,
                  keyPress: this.handleInputSelectTagsChange,
                  values: this.state.tags.value,
                  blur: this.handleOnBlur,
                  focus: this.handleOnFocus,
                  error: error && error.tags && error.tags.detail,
                  remove: this.handleRemove,
                }}
              />
              <AddFilesInput
                error={error && error.docs && error.docs.detail}
                docs={this.state.docs.value}
                onFileChange={this.handleInputFileChange}
                blur={this.handleOnBlur}
              />
            </div>
            <div className="form-content">
              <InfoPanel selectTab={selectTab} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default DetailProject;
