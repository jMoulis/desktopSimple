import { connect } from 'react-redux';

import TaskCreateForm from '../../../../components/TaskDetailWrapper/TaskDetail/TaskCreateForm';
import {
  createTaskAction,
  clearTaskMessageAction,
} from '../../../../../../../store/reducers/taskReducer';

const mapStateToProps = ({ taskReducer, mainTeamReducer }) => ({
  taskCreation: taskReducer.taskCreation,
  teamId: mainTeamReducer.activeTeamProcess.team._id,
});

const mapDispatchToProps = dispatch => ({
  createTaskAction: values => {
    dispatch(createTaskAction(values));
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
