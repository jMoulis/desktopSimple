import { connect } from 'react-redux';

import TaskDetail from '../../../components/TaskDetailWrapper/TaskDetail';

const mapStateToProps = ({ taskReducer }) => ({
  task: taskReducer.activeTaskProcess.task,
});

const createContainer = connect(
  mapStateToProps,
  null,
);
const TaskDetailContainer = createContainer(TaskDetail);
export default TaskDetailContainer;
