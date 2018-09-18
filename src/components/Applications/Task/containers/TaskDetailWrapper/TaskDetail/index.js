import { connect } from 'react-redux';

import TaskDetail from '../../../components/TaskDetailWrapper/TaskDetail';
import {
  editTaskAction,
  deleteTaskAction,
} from '../../../../../../store/reducers/taskReducer';

const mapStateToProps = ({ taskReducer, authReducer }) => ({
  activeTaskProcess: taskReducer.activeTaskProcess,
  loggedUser: authReducer.loginProcess.loggedUser,
});

const mapDispatchProps = dispatch => ({
  editTaskAction: values => {
    dispatch(editTaskAction(values));
  },
  deleteTaskAction: id => {
    dispatch(deleteTaskAction(id));
  },
});

const createContainer = connect(
  mapStateToProps,
  mapDispatchProps,
);
const TaskDetailContainer = createContainer(TaskDetail);
export default TaskDetailContainer;
