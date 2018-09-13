import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import TabContent from './TabContent';
import TabNav from './TabNav';
import TaskCommentFormContainer from '../../../containers/TaskDetailWrapper/TaskDetail/TaskComment/TaskCommentForm';
import Button from '../../../../../Form/button';

class TaskActivity extends React.Component {
  static propTypes = {
    task: PropTypes.object.isRequired,
  };
  state = {
    type: 'comments',
  };
  handleTabClick = evt => {
    const { type } = evt.target.dataset;
    this.setState(() => ({
      type,
    }));
  };
  render() {
    const { task } = this.props;
    const { type } = this.state;
    return (
      <div className="task-activity">
        <TabNav onClick={this.handleTabClick} type={type} />
        {type === 'activities' ? (
          <ul>
            {task &&
              task.activities &&
              task.activities.map((activity, index) => (
                <TabContent key={index} data={activity} type={activity.type} />
              ))}
          </ul>
        ) : (
          <ul>
            <li>{<TaskCommentFormContainer />}</li>
            {task &&
              task.comments &&
              task.comments.map((comment, index) => (
                <TabContent key={index} data={comment} type="comment">
                  {comment.message}
                  <ul className="d-flex">
                    <li>
                      <Button
                        style={{
                          margin: 0,
                        }}
                        label="Delete"
                        category="danger"
                        small
                      />
                    </li>
                    <li>
                      <Button
                        style={{
                          margin: 0,
                        }}
                        label="Edit"
                        small
                      />
                    </li>
                  </ul>
                </TabContent>
              ))}
          </ul>
        )}
      </div>
    );
  }
}

export default TaskActivity;
