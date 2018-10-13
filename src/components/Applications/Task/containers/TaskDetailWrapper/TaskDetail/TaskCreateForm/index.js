import { connect } from 'react-redux';

import TaskCreateForm from '../../../../components/TaskDetailWrapper/TaskDetail/TaskCreateForm';
import {
  createTaskAction,
  clearTaskMessageAction,
  fetchTasksAction,
} from '../../../../../../../store/reducers/taskReducer';

const mapStateToProps = ({ taskReducer, mainTeamReducer }) => ({
  taskCreation: taskReducer.taskCreation,
  teamId: mainTeamReducer.activeTeamProcess.team._id,
});

const mapDispatchToProps = dispatch => ({
  createTaskAction: values => {
    dispatch(createTaskAction(values));
  },
  fetchTasksAction: filter => {
    dispatch(fetchTasksAction(filter));
  },
  clearTaskMessageAction: () => {
    dispatch(clearTaskMessageAction());
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const TaskCreateFormContainer = createContainer(TaskCreateForm);
export default TaskCreateFormContainer;
