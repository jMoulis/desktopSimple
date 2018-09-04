import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import TabContent from './TabContent';
import TabNav from './TabNav';

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
      <div className="task-activity height-overflow">
        <TabNav onClick={this.handleTabClick} type={type} />
        {type === 'activities' ? (
          <ul className="overflow height-overflow">
            {task &&
              task.activities &&
              task.activities.map((activity, index) => (
                <TabContent key={index} data={activity} type={activity.type} />
              ))}
          </ul>
        ) : (
          <ul className="overflow height-overflow">
            {task &&
              task.comments &&
              task.comments.map((comment, index) => (
                <TabContent key={index} data={comment} type="comment">
                  {comment.message}
                </TabContent>
              ))}
          </ul>
        )}
      </div>
    );
  }
}

export default TaskActivity;
