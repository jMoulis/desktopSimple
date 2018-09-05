import { connect } from 'react-redux';

import Task from '../components';
import { fetchTasksAction } from '../../../../store/reducers/taskReducer';

const mapStateToProps = ({ taskReducer, appReducer }) => ({
  taskListProcess: taskReducer.taskListProcess,
  showOverflow: appReducer.showOverflow,
});

const mapDispatchToProps = dispatch => ({
  fetchTasksAction: filter => {
    dispatch(fetchTasksAction(filter));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TaskContainer = createContainer(Task);
export default TaskContainer;
