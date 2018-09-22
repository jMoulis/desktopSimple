import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Textarea from '../../../../../../../Form/textarea';
import Button from '../../../../../../../Form/button';
import autoTextAreaResizing from '../../../../../../../../Utils/autoTextAreaResizing';

class TaskCommentEditForm extends Component {
  static propTypes = {
    editCommentTaskAction: PropTypes.func.isRequired,
    deleteCommentTaskAction: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
    taskId: PropTypes.string.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      id: props.comment._id,
      message: {
        value: props.comment.message,
        changed: false,
      },
      showButton: true,
      showEditComment: false,
    };
  }

  handleSubmit = () => {
    const { editCommentTaskAction, taskId, comment } = this.props;
    editCommentTaskAction(taskId, comment._id, this.state);
    this.setState(() => ({
      showButton: true,
      showEditComment: false,
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
  handleBlur = () => {
    if (this.state.message.changed) return null;
    return this.setState(() => ({
      showButton: true,
      showEditComment: false,
    }));
  };
  handleShowEditComment = () => {
    this.setState(prevState => ({
      showEditComment: !prevState.showEditComment,
      showButton: !prevState.showButton,
    }));
  };
  handleCancel = () => {
    // Must replace the form message with the old
    this.setState(prevState => ({
      ...prevState,
      message: {
        value: this.props.comment.message,
        changed: false,
      },
      showButton: true,
      showEditComment: false,
    }));
  };
  render() {
    const { message, showButton, showEditComment } = this.state;
    const { comment, taskId, deleteCommentTaskAction } = this.props;
    return (
      <div className="relative">
        {!showEditComment ? (
          comment.message
        ) : (
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
            }}
          />
        )}
        <ul className="d-flex">
          {showButton ? (
            <Fragment>
              <li>
                <Button
                  style={{
                    margin: 0,
                  }}
                  label="Delete"
                  category="danger"
                  small
                  onClick={() => deleteCommentTaskAction(taskId, comment._id)}
                />
              </li>
              <li>
                <Button
                  style={{
                    margin: 0,
                  }}
                  label="Edit"
                  small
                  onClick={this.handleShowEditComment}
                />
              </li>
            </Fragment>
          ) : (
            <Fragment>
              <Button
                style={{
                  margin: 0,
                }}
                category="primary"
                label="Cancel"
                small
                onClick={this.handleCancel}
              />
              <Button
                style={{
                  margin: 0,
                }}
                category={message.changed ? 'success' : 'secondary'}
                label="Send"
                small
                onClick={this.handleSubmit}
                disabled={!message.changed}
              />
            </Fragment>
          )}
        </ul>
      </div>
    );
  }
}

export default TaskCommentEditForm;
