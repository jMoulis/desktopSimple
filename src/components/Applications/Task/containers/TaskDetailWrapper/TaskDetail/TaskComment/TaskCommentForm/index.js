import { connect } from 'react-redux';

import { editTaskAction } from '../../../../../../../../store/reducers/taskReducer';
import TaskCommentForm from '../../../../../components/TaskDetailWrapper/TaskDetail/TaskComment/TaskCommentForm';

const mapStateToProps = ({ taskReducer, authReducer }) => ({
  activeTaskProcess: taskReducer.activeTaskProcess,
  loggedUser: authReducer.loginProcess.loggedUser,
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
const TaskCommentFormContainer = createContainer(TaskCommentForm);
export default TaskCommentFormContainer;
