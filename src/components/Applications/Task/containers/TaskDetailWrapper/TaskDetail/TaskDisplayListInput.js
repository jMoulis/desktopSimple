import { connect } from 'react-redux';

import TaskDisplayListInput from '../../../components/TaskDetailWrapper/TaskDetail/TaskDisplayListInput';

const mapStateToProps = ({ taskReducer }) => ({
  task: taskReducer.activeTaskProcess.task,
});

const createContainer = connect(
  mapStateToProps,
  null,
);
const TaskDisplayListInputContainer = createContainer(TaskDisplayListInput);
export default TaskDisplayListInputContainer;
