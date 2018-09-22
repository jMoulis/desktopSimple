import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Textarea from '../../../../../../../Form/textarea';
import Button from '../../../../../../../Form/button';
import autoTextAreaResizing from '../../../../../../../../Utils/autoTextAreaResizing';
import UserIconContainer from '../../../../../../../../Modules/UserIcon';

class TaskCommentForm extends Component {
  static propTypes = {
    activeTaskProcess: PropTypes.object.isRequired,
    editTaskAction: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      message: {
        value: '',
        changed: false,
      },
      showButton: false,
    };
  }
  handleSubmit = () => {
    const { editTaskAction } = this.props;
    editTaskAction(this.state);
    this.setState(() => ({
      showButton: false,
      message: {
        value: '',
        changed: false,
      },
    }));
  };
  handleTextAreaChange = evt => {
    const { value } = evt.target;
    autoTextAreaResizing(evt.target);
    this.setState(prevState => ({
      ...prevState,
      message: {
        value,
        changed: true,
      },
    }));
  };
  handleFocus = () => {
    this.setState(() => ({
      showButton: true,
    }));
  };
  handleBlur = () => {
    if (this.state.message.changed) return null;
    return this.setState(() => ({
      showButton: false,
    }));
  };
  render() {
    const { activeTaskProcess, loggedUser } = this.props;
    const { error } = activeTaskProcess;
    const { message, showButton } = this.state;
    return (
      <div className="task-comment-form">
        <div className="d-flex full-width">
          <UserIconContainer
            user={{
              user: {
                _id: loggedUser._id,
                picture: loggedUser.picture,
                fullName: loggedUser.fullName,
              },
            }}
            classCss="middle"
          />
          <Textarea
            config={{
              field: {
                type: 'text',
                name: 'message',
                placeholder: 'Click to write a comment',
              },
              onChange: this.handleTextAreaChange,
              focus: this.handleFocus,
              blur: this.handleBlur,
              keyPress: this.handleTextAreaChange,
              value: message.value,
              small: true,
              error: error && error.message && error.message.detail,
            }}
          />
        </div>
        {showButton && (
          <Button
            style={{
              margin: 0,
              position: 'absolute',
              bottom: '12px',
              right: 0,
            }}
            category={message.changed ? 'success' : 'secondary'}
            label="Send"
            small
            onClick={this.handleSubmit}
            disabled={!message.changed}
          />
        )}
      </div>
    );
  }
}

export default TaskCommentForm;
