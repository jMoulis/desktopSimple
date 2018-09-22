import { connect } from 'react-redux';

import TaskList from '../../components/TaskList';
import { fetchSingleTaskAction } from '../../../../../store/reducers/taskReducer';

const mapStateToProps = ({ taskReducer }) => ({
  tasks: taskReducer.taskListProcess.tasks,
  activeTask: taskReducer.activeTaskProcess.task,
});

const mapDispatchToProps = dispatch => ({
  fetchSingleTaskAction: taskId => {
    dispatch(fetchSingleTaskAction(taskId));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TaskListContainer = createContainer(TaskList);
export default TaskListContainer;
