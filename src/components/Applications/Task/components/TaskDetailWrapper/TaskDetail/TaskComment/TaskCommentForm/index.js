import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Textarea from '../../../../../../../Form/textarea';
import Button from '../../../../../../../Form/button';
import autoTextAreaResizing from '../../../../../../../../Utils/autoTextAreaResizing';
import UserIconContainer from '../../../../../../../../Modules/UserIcon';

class TaskCommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        value: '',
        changed: false,
      },
    };
  }
  handleSubmit = () => {
    const { editTaskAction } = this.props;
    editTaskAction(this.state);
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
  render() {
    const { activeTaskProcess, loggedUser } = this.props;
    const { error, success } = activeTaskProcess;
    const { message } = this.state;
    return (
      <div className="task-comment-form">
        <span className="bold">Add a comment</span>
        <div className="d-flex">
          <UserIconContainer user={{ user: loggedUser }} classCss="middle" />
          <Textarea
            config={{
              field: {
                type: 'text',
                label: 'Message',
                name: 'message',
              },
              onChange: this.handleTextAreaChange,
              keyPress: this.handleTextAreaChange,
              value: message.value,
              small: true,
              success,
              error: error && error.message && error.message.detail,
            }}
          />
        </div>
        <Button category="success" label="Send" onClick={this.handleSubmit} />
      </div>
    );
  }
}

TaskCommentForm.propTypes = {};

export default TaskCommentForm;
