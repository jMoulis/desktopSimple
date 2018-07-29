import { connect } from 'react-redux';

import Task from '../components';
import { fetchTasksAction } from '../../../../store/reducers/taskReducer';

const mapStateToProps = ({ taskReducer }) => ({
  taskListProcess: taskReducer.taskListProcess,
});

const mapDispatchToProps = dispatch => ({
  fetchTasksAction: () => {
    dispatch(fetchTasksAction());
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TaskContainer = createContainer(Task);
export default TaskContainer;
