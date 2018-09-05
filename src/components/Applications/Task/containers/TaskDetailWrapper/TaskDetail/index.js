import { connect } from 'react-redux';

import TaskDetail from '../../../components/TaskDetailWrapper/TaskDetail';
import { editTaskAction } from '../../../../../../store/reducers/taskReducer';

const mapStateToProps = ({ taskReducer }) => ({
  task: taskReducer.activeTaskProcess.task,
});

const mapDispatchProps = dispatch => ({
  editTaskAction: values => {
    dispatch(editTaskAction(values));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchProps,
);
const TaskDetailContainer = createContainer(TaskDetail);
export default TaskDetailContainer;
